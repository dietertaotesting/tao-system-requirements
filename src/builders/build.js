import buildApi from './api.js';
import buildHtml from './html.js';
import fs from 'fs-extra';
import buildCss from './css.js';
import compareVersions from 'compare-versions';
import paths from '../config/paths.json';

const apiFiles = fs.readdirSync(paths.api.out).map(entry => `${paths.api.out}/${entry}`);

const getLastVersions = () => {
    let versions = new Set();
    apiFiles.forEach(file => {
        const match = file.match(/-(\d.*)\.json$/);
        if (match && match[1]) {
            versions.add(match[1]);
        }
    })
    versions = Array.from(versions).sort(compareVersions).reverse();
    return versions.slice(0, 3);
}

const removeLegacyFiles = () => {
    const lastVersions = getLastVersions();    
    apiFiles.forEach(file => {
        const match = file.match(/(\d.*)\.json$/);
        if (match && match[1] && !lastVersions.includes(match[1])) {
            fs.unlink(file);
        }
    })
}

const removeLegacyViewportDeviceXml = () => {
    const lastVersions = getLastVersions(); 
    for (let file of fs.readdirSync(`${paths.data.in}/viewport-devices`)) {
        let path = `${paths.data.in}/viewport-devices/${file}`
        let xml = fs.readFileSync(path, 'utf8');
        const match = xml.match(/"tao":{"version":"(\d[^"]+)"/);
        if (match && match[1] && !lastVersions.includes(match[1])) {
            fs.unlink(path);
        }
    }
}

const build = () => {
    fs.copySync('src/assets/web', 'build');
    buildCss();
    buildApi();
    buildHtml();
    removeLegacyFiles();
    removeLegacyViewportDeviceXml();
}

export default build();
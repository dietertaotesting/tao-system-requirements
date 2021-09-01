import buildApi from './api.js';
import buildHtml from './html.js';
import fs from 'fs-extra';
import buildCss from './css.js';
import compareVersions from 'compare-versions';
import paths from '../config/paths.json';
import status from './status.js';
import console from 'a-nicer-console';
import systemRequirements from "../data-provider/systemRequirements.js";


const apiFiles = fs.readdirSync(paths.api.out).map(entry => `${paths.api.out}/${entry}`);

/**
 * Collect names of the last three versions
 * @returns {*}
 */
const getRetainableReleases = () => {
    let releases = new Set();
    apiFiles.forEach(file => {
        const match = file.match(/-(\d.*)\.json$/);
        if (match && match[1]) {
            releases.add(match[1]);
        }
    })
    releases = Array.from(releases).sort(compareVersions).reverse();
    return releases.slice(0, 3);
}

/**
 * Delete legacy files
 * @param currentRelease
 */
const collectGarbage = currentRelease => {
    const retainableReleases = getRetainableReleases();
    const legacyFiles = systemRequirements.getMetaData().viewportDevices
        .filter(entry => {
            return compareVersions(entry.release, currentRelease) === -1;
        })
        .map(entry => entry.path);

    apiFiles.forEach(file => {
        const match = file.match(/(\d.*)\.json$/);
        if (match && match[1] && !retainableReleases.includes(match[1])) {
            legacyFiles.push(file);
        }
    })
    legacyFiles.forEach(file => {
        fs.unlink(file);
    })
}

/**
 * Build new API files and webpage
 * @returns {boolean}
 */
const build = () => {
    const currentStatus = status.getData();

    if (!currentStatus.buildRequired) {
        console.info(`\nAPI already at release ${currentStatus.release}, no build required`);
        status.render(currentStatus);
        return false;
    } else if (!currentStatus.canBuild) {
        console.error(`\nSome entries aren't at release ${currentStatus.release}, build will be halted.`);
        status.render(currentStatus);
        return false;
    }
    const msg = currentStatus.lastMods.length ?
        `There have been changes after the last build` :
        `All relevant data are at release ${currentStatus.release}`;
    console.info(`\n${msg}, build will proceed.\n`);
    console.info(`Status before build:`);
    status.render(currentStatus);
    fs.copySync('src/assets/web', 'build');
    buildCss();
    buildApi();
    buildHtml();
    collectGarbage(currentStatus.release);
}

export default build();
import fs from 'fs-extra';
import release from './tao-release.js';
import paths from '../config/paths.json';
import parser from 'fast-xml-parser';
import _ from 'lodash';

const getMetaData = () => {
    const data = [];
    const vpPath = `${paths.data.in}/viewport-devices`;
    for (let file of fs.readdirSync(vpPath)) {
        let path = `${vpPath}/${file}`;
        const stats = fs.statSync(path);
        const match = fs.readFileSync(path, 'utf8').match(/"tao":{"release":"(?<release>[^"]+)"/);
        if (!match) {
            fs.unlink(path);
            continue;
        }
        data.push({
            path,
            release: match.groups.release,
            lastMod: new Date(stats.mtime)
        })
    }
    return data;
}


const getResultXml = () => {
    const currentRelease = release.getData();
    const data = [];
    getMetaData().forEach(fileData => {
        if(fileData.release === currentRelease){
            data.push(fs.readFileSync(fileData.path, 'utf8')) 
        }
    })
    return data;
}



const getData = () => {
    let data = new Set();

    getResultXml().forEach((xml, i) => {
        let currData = parser.parse(xml, {
            ignoreAttributes: false
        });

        // remove everything other than items
        currData = currData.assessmentResult.itemResult
            .map(mEntry => {
                let data = mEntry.responseVariable
                    .filter(fEntry => ['yes', 'no'].includes(fEntry.candidateResponse.value) || fEntry.candidateResponse.value.includes('{')).pop();
                if (!data) {
                    return false;
                }
                data.comment = mEntry.candidateComment || '';
                data.key = data['@_identifier'].replace('-interaction', '');
                data.label = _.startCase(data.key.replace(/-/g, ' '));
                data.response = data.candidateResponse.value;
                delete data['@_cardinality'];
                delete data['@_baseType'];
                delete data['@_identifier'];
                delete data['candidateResponse'];

                return data;
            })

        currData = currData.filter(entry => entry);

        let env = currData.find(eEntry => {
            return eEntry.response.startsWith('{');
        });
        env = JSON.parse(env.response);
        env.key = `${env.screen.width}-${env.screen.height}-${env.screen.orientation}`;
        env.deviceStr = Object.values(env.device).join(' ').trim();
        env.label = `${env.screen.width} × ${env.screen.height}`;

        currData = currData.filter(entry => !entry.response.startsWith('{'));

        currData = currData.filter(entry => entry.response !== 'yes' || entry.comment);

        currData.forEach(entry => {
            entry.comment = entry.comment || 'Failed';
        })
        data.add({
            env,
            interactions: currData
        })
    });
    data = Array.from(data);
    data.sort((a, b) => {
        if (a.env.screen.width < b.env.screen.width) {
            return -1;
        }
        if (a.env.screen.width > b.env.screen.width) {
            return 1;
        }
        return 0;
    })
    return data;

}

export default {
    getData,
    getMetaData
}
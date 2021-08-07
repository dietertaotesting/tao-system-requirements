import fs from 'fs-extra';
import getVersion from './version.js';
import paths from '../config/paths.json';
import parser from 'fast-xml-parser';
import _ from 'lodash';


const getResultXml = () => {
    const data = [];
    for (let file of fs.readdirSync(`${paths.data.in}/viewport-devices`)) {
        let path = `${paths.data.in}/viewport-devices/${file}`
        let xml = fs.readFileSync(path, 'utf8');
        if (xml.includes(`"tao":{"version":"${getVersion()}"`)) {
            data.push(xml);
        }
    }
    return data;
}



const getViewportDeviceData = () => {
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

export default getViewportDeviceData;
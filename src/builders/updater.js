import fs from 'fs-extra';
import prompts from 'prompts';
import paths from '../config/paths.json';
import _ from 'lodash';
import logger from '../modules/logger.js';


// it is important to use the raw data rather then those already treated by getServerData() | release.getData()!
const releasePath = `${paths.data.in}/tao-release.json`;
let release = fs.readJSONSync(releasePath, 'utf8');

const serverPath = `${paths.data.in}/server.json`;
let serverData = fs.readJSONSync(serverPath, 'utf8');

const buildQuestions = () => {
    const questions = [{
        type: 'text',
        name: 'taoRelease',
        message: 'TAO Release'.padEnd(15),
        initial: release
    }];
    delete(serverData.release);
    for (let [type, typeValues] of Object.entries(serverData)) {
        for (let [component, componentValues] of Object.entries(typeValues)) {
            componentValues.forEach(value => {
                questions.push({
                    type: 'text',
                    name: `${type}.${component}.${value.label}`,
                    message: `${value.label}`.padEnd(15),
                    initial: value.versions.join(', ')
                })
            });
        }
    }
    return questions;
}

const process = response => {
    try {
        const release = response.taoRelease;
        delete(response.taoRelease);
        
        for (let [keys, versions] of Object.entries(response)) {
            keys = keys.split('.');
            const label = keys.pop();
            serverData[keys[0]][keys[1]].forEach(entry => {
                if (entry.label === label) {
                    entry.versions = versions.split(',');
                }
            });
        }
        serverData.release = release; // record at the time of creation
        fs.writeJsonSync(releasePath, release);
        fs.writeJsonSync(serverPath, serverData, {
            spaces: '\t'
        });
        logger.success(`Finished updating data for release ${release}.`);
    }
    catch(e) {
        logger.error(`Process failed with message "${e}"`);
    }
}

const update = async () => {
    const questions = buildQuestions();
    logger.success('\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    logger.success(` Check if the following versions are correct and overwrite values that aren't.`);
    logger.success(` Please edit ${paths.data.in}/server.json directly to add or remove components.`);
    logger.success('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n');
    const response = await prompts(questions);
    process(response);
}

export default update();
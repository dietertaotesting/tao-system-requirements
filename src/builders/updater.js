import fs from 'fs-extra';
import prompts from 'prompts';
import paths from '../config/paths.json';
import compareVersions from 'compare-versions';
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

const confirm = messages => {
    logger.log(`\nThis will be your new set-up:`);
    messages.forEach((value, key) => {
        const fn = value === 'delete' ? 'warning' : 'info';
        logger[fn](` - ${key.padEnd(20)} ${value}`)
    })
}

const validateVersions = (versions, type, component) => {
    if (type !== 'stack' && versions.length > 1) {
        logger.error(`Entry doesn't accept multiple versions, the process will terminate.`);
        process.exit(-1);
    }
    if (versions.includes('n/a')) {
        versions = ['n/a'];
    }
    if (type !== 'stack' && versions[0] === 'n/a') {
        logger.error(`You can't delete entries from ${component}, the process will terminate.`);
        process.exit(-1);
    }
    versions.forEach(version => {
        if (!compareVersions.validate(version) && version !== 'n/a') {
            logger.error(`${version} isn't a valid version, the process will terminate.`);
            process.exit(-1);
        }
    })
    return versions;
}

const processData = response => {
    try {
        const release = response.taoRelease;
        const messages = new Map([['TAO', release]]);
        validateVersions([release], 'TAO', 'TAO');
        delete(response.taoRelease);

        for (let [keys, versions] of Object.entries(response)) {
            const [type, component, label] = keys.split('.');
            versions = validateVersions(versions.split(',').map(version => version.trim()), type, component);
            serverData[type][component].forEach((entry, index) => {
                if (entry.label === label) {
                    versions.forEach(version => {
                        if (version === 'n/a') {
                            messages.set(serverData[type][component][index].label, 'delete');
                        }
                    })
                    if (versions[0] !== 'n/a') {
                        messages.set(serverData[type][component][index].label, versions.join(', '));
                    }
                    entry.versions = versions;
                }
            });
            serverData[type][component] = serverData[type][component].filter(entry => entry.versions[0] !== 'n/a');
        }
        confirm(messages);
        prompts({
            type: 'confirm',
            name: 'value',
            message: 'Shall I proceed?'
        }).then(response => {
            if (response.value) {
                serverData.release = release; // record at the time of creation
                fs.writeJsonSync(releasePath, release);
                fs.writeJsonSync(serverPath, serverData, {
                    spaces: '\t'
                });
                logger.success(`Finished updating data for release ${release}.`);
            }
            else {
                logger.info(`Process terminated by user.`);
                process.exit(-1);
            }
        })

    } catch (e) {
        logger.error(`Process failed with message "${e}"`);
    }
}

const update = async () => {
    const questions = buildQuestions();
    logger.success('\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    logger.success(` Check if the following versions are correct and overwrite values that aren't.`);
    logger.success(` Server components (Server, DB, PHP) only:`);
    logger.success(`  - Separate multiple versions by a comma`);
    logger.success(`  - Setting a version to "n/a" will remove the component`);
    logger.success(`  - Please edit ${paths.data.in}/server.json directly to add components`);
    logger.success('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n');
    const response = await prompts(questions);
    processData(response);
}

export default update();
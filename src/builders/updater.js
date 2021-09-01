import fs from 'fs-extra';
import prompts from 'prompts';
import paths from '../config/paths.json';
import compareVersions from 'compare-versions';
import console from 'a-nicer-console';

/**
 * it is important to use the raw data rather then those already processed by getServerData() | release.getData()!
 */
const releasePath = `${paths.data.in}/tao-release.json`;
let release = fs.readJsonSync(releasePath, 'utf8');

const serverPath = `${paths.data.in}/server.json`;
let serverData = fs.readJsonSync(serverPath, 'utf8');

const downloadPath = `${paths.data.in}/downloads.json`;
let downloadData = fs.readJsonSync(downloadPath, 'utf8');

/**
 * Build questions on server and TAO versions
 * @returns {[{initial: *, name: string, type: string, message: string}]}
 */
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

/**
 * Confirm with "y/N" if the data are correct, default = N
 * @param messages
 */
const confirm = messages => {
    console.log(`\nThis will be your new set-up:`);
    messages.forEach((value, key) => {
        const fn = value === 'delete' ? 'warning' : 'info';
        console[fn](` - ${key.padEnd(20)} ${value}`)
    })
}

/**
 * Validate if all versions are semver
 * @param versions
 * @param type
 * @param component
 * @returns {string[]}
 */
const validateVersions = (versions, type, component) => {
    // only one TAO version
    if (type !== 'stack' && versions.length > 1) {
        console.error(`Entry doesn't accept multiple versions, the process will terminate.`);
        process.exit(-1);
    }
    // n/a is valid but can't be tested for semver
    if (versions.includes('n/a')) {
        versions = ['n/a'];
    }
    // only server side entries can be deleted
    if (type !== 'stack' && versions[0] === 'n/a') {
        console.error(`You can't delete entries from ${component}, the process will terminate.`);
        process.exit(-1);
    }
    versions.forEach(version => {
        if (!compareVersions.validate(version) && version !== 'n/a') {
            console.error(`${version} isn't a valid version, the process will terminate.`);
            process.exit(-1);
        }
    })
    return versions;
}

/**
 * Update the "database" files
 * @param response
 */
const processData = response => {
    try {
        const release = response.taoRelease;
        const messages = new Map([['TAO', release]]);
        validateVersions([release], 'TAO', 'TAO');
        delete(response.taoRelease);

        for (let [keys, versions] of Object.entries(response)) {
            const [type, component, label] = keys.split('.');
            versions = validateVersions(versions.split(',').map(version => version.trim()), type, component);
            // build messages
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
            // delete "n/a" entries
            serverData[type][component] = serverData[type][component].filter(entry => entry.versions[0] !== 'n/a');
        }
        confirm(messages);
        prompts({
            type: 'confirm',
            name: 'value',
            message: 'Shall I proceed?'
        }).then(response => {
            if (response.value) {
                // record at the time of creation
                serverData.release = release;
                downloadData.release = release; 
                fs.writeJsonSync(releasePath, release);
                fs.writeJsonSync(serverPath, serverData, {
                    spaces: '\t'
                });
                fs.writeJsonSync(downloadPath, downloadData, {
                    spaces: '\t'
                });
                console.success(`Finished updating data for release ${release}.`);
            }
            else {
                console.info(`Process terminated by user.`);
                process.exit(-1);
            }
        })

    } catch (e) {
        console.error(`Process failed with message "${e}"`);
    }
}

const update = async () => {
    const questions = buildQuestions();
    console.success('\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.success(` Check if the following versions are correct and overwrite values that aren't.`);
    console.success(` Server components (Server, DB, PHP) only:`);
    console.success(`  - Separate multiple versions by a comma`);
    console.success(`  - Setting a version to "n/a" will remove the component`);
    console.success(`  - Please edit ${paths.data.in}/server.json directly to add components`);
    console.success('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n');
    const response = await prompts(questions);
    processData(response);
}

export default update();
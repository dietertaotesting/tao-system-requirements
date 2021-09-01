import common from './download-server-common.js';
import release from './tao-release.js';

/**
 * Meta data
 * @returns {{path: `${string}/${string}.json`, release, lastMod: Date}[]}
 */
const getMetaData = () => {
    return common.getMetaData('downloads');
}

/**
 * Fetch and return data from data/downloads.json
 * @returns {Object}
 */
const getData = () => {
    const currentRelease = release.getData();
    return common.getData('downloads', entry => {
        for (let [key, value] of Object.entries(entry)) {
            entry[key] = value.replace('{{release}}', currentRelease)
        }
        return entry;
    })
}

export default {
    getData,
    getMetaData
}
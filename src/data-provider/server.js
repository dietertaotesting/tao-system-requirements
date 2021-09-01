import common from './download-server-common.js';

/**
 * Metadata
 * @returns {{path: `${string}/${string}.json`, release, lastMod: Date}[]}
 */
const getMetaData = () => {
    return common.getMetaData('server');
}

/**
 * Fetch and return data from data/server.json
 * @returns {Object}
 */
const getData = () => {
    return common.getData('server', entry => {
        entry.versionStr = entry.versions.join(', ');
        entry.key = entry.label.toLowerCase().replace(/\W+/g, '-');
        return entry;
    });
}

export default {
    getData,
    getMetaData
}
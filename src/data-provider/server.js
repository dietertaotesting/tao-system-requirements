import common from './download-server-common.js';


const getMetaData = () => {
    return common.getMetaData('server');
}

/**
 * Fetch and return data from 
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
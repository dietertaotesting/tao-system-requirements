import common from './download-server-common.js';
import release from './tao-release.js';

const getMetaData = () => {
    return common.getMetaData('downloads');
}

/**
 * Fetch and return data from 
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
import fs from 'fs-extra';
import paths from '../config/paths.json';

/**
 * Downloads and server side have the same structure and some methods can be shared
 */

/**
 * Path to the file
 * @param type
 * @returns {`${string}/${string}.json`}
 */
const getPath = type => {
    return `${paths.data.in}/${type}.json`;
}

/**
 * Metadata
 * @param type
 * @returns {[{path: `${string}/${string}.json`, release, lastMod: Date}]}
 */
const getMetaData = type => {
    const path = getPath(type);
    const data = fs.readJsonSync(path);
    const stats = fs.statSync(path);

    return [
        {
            path,
            release: data.release,
            lastMod: new Date(stats.mtime)
        }
    ]
}

/**
 * Data
 * @param type
 * @param callback
 * @returns {*}
 */
const getData = (type, callback) => {
    const data = fs.readJsonSync(getPath(type));
    delete data.release;
    for(let components of Object.values(data)){
        for(let entries of Object.values(components)){
            entries = entries.map(entry => callback(entry))
        }
    }
    return data;
}

export default {
    getData,
    getMetaData
}
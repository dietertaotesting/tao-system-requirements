import fs from 'fs-extra';
import paths from '../config/paths.json';

/**
 * Get meta data from last build
 * @returns {[{path: string, release: string, lastMod: string}]}
 */
const getMetaData = () => {
    let data = {
        path: 'not found: system-requirements-latest.json',
        release: 'n/a',
        lastMod: 'n/a'
    }
    try {
        const path = `${paths.api.out}/system-requirements-latest.json`;
        const stats = fs.statSync(path);
        data = {
            path,
            release: fs.readJsonSync(path).release,
            lastMod: new Date(stats.mtime)
        }
    } catch (e) {

    }

    return [
        data
    ]
}

/**
 * Get data from last build
 * @returns {*}
 */
const getData = () => {
    return getMetaData().release;
}

export default {
    getData,
    getMetaData
}
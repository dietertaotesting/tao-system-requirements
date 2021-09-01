import fs from 'fs-extra';
import paths from '../config/paths.json';

/**
 * Retrieve metadata from data/tao-release.json
 * @returns {[{path: string, release, lastMod: Date}]}
 */
const getMetaData = () => {
    const path = `${paths.data.in}/tao-release.json`;
    const stats = fs.statSync(path);

    return [
        {
            path,
            release: fs.readJsonSync(path),
            lastMod: new Date(stats.mtime)
        }
    ]
}

/**
 * Retrieve data - the release in this case - from data/tao-release.json
 * @returns {*}
 */
const getData = () => {
    return getMetaData()[0].release;
}

export default {
    getData,
    getMetaData
}

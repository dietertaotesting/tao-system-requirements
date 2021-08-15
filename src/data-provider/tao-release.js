import fs from 'fs-extra';
import paths from '../config/paths.json';

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

const getData = () => {
    return getMetaData()[0].release;
}

export default {
    getData,
    getMetaData
}

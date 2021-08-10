import fs from 'fs-extra';
import paths from '../config/paths.json';

const getRelease = () => {
    return fs.readJsonSync(`${paths.data.in}/tao-release.json`);
}

export default getRelease;

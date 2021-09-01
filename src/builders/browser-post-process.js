import paths from '../config/paths.json';
import fs from 'fs-extra';
import taoRelease from '../data-provider/tao-release.js';

/**
 * Create meta data for recommended browsers
 */
const postProcess = () => {
    const path = `${paths.data.in}/browser-meta.json`;

    fs.writeJsonSync(path, {
        path,
        release: taoRelease.getData(), // release at the time of this update
        lastMod: new Date()
    }, {
        spaces: '\t'
    })
}

export default postProcess();
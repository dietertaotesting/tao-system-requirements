import paths from '../config/paths.json';
import fs from 'fs-extra';
import gitCommitInfo from "git-commit-info";
import taoRelease from '../data-provider/tao-release.js';


const postProcess = () => {
    const path = `${paths.data.in}/browser-meta.json`;
    const commitInfo = gitCommitInfo(paths.data.in);

    fs.writeJsonSync(path, {
        path,
        release: taoRelease.getData(), // release at the time of this update
        lastMod: new Date(),
        lastCommit: new Date(commitInfo.date)
    }, {
        spaces: '\t'
    })
}

export default postProcess();
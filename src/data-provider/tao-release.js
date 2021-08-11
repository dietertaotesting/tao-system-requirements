import fs from 'fs-extra';
import paths from '../config/paths.json';
import gitCommitInfo from "git-commit-info";

const getMetaData = () => {
    const path = `${paths.data.in}/tao-release.json`;
    const commitInfo = gitCommitInfo(paths.data.in);
    const stats = fs.statSync(path);

    return [
        {
            path,
            release: fs.readJsonSync(path),
            lastMod: new Date(stats.mtime),
            lastCommit: new Date(commitInfo.date)
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

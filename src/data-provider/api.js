import fs from 'fs-extra';
import paths from '../config/paths.json';
import gitCommitInfo from "git-commit-info";

const getMetaData = () => {
    let data = {
        path: 'not found: system-requirements-latest.json',
        release: 'n/a',
        lastMod: 'n/a',
        lastCommit: 'n/a'
    }
    try {
        const path = `${paths.api.out}/system-requirements-latest.json`;
        const commitInfo = gitCommitInfo(paths.data.in);
        const stats = fs.statSync(path);
        data = {
            path,
            release: fs.readJsonSync(path).release,
            lastMod: new Date(stats.mtime),
            lastCommit: new Date(commitInfo.date)
        }
    } catch (e) {

    }

    return [
        data
    ]
}

const getData = () => {
    return getMetaData().release;
}

export default {
    getData,
    getMetaData
}
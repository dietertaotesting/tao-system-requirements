import fs from 'fs-extra';
import paths from '../config/paths.json';
import gitCommitInfo from "git-commit-info";

const getMetaData = () => {
    const path = `${paths.data.in}/server.json`;
    const data = fs.readJsonSync(path);
    const commitInfo = gitCommitInfo(paths.data.in);
    const stats = fs.statSync(path);

    return [
        {
            path,
            release: data.release,
            lastMod: new Date(stats.mtime),
            lastCommit: new Date(commitInfo.date)
        }
    ]
}

/**
 * Fetch and return data from 
 * @returns {{stack: {database: {}, server: {}, language: {}}, virtualized: {container: {}}}}
 */
const getData = () => {
    const data = fs.readJsonSync(`${paths.data.in}/server.json`);
    delete data.release;
    [
        data.stack.server,
        data.stack.database,
        data.stack.language,
        data.virtualized.container
    ].forEach(group => {
        group = group.map(entry => {
            entry.versionStr = entry.versions.join(', ');
            entry.key = entry.label.toLowerCase().replace(/\W+/g, '-');
            return entry;
        })
    })
    return data;
}

export default {
    getData,
    getMetaData
}
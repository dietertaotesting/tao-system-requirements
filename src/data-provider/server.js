import data from '../data/server.json';

/**
 * Fetch and return data from 
 * @returns {{stack: {database: {}, server: {}, language: {}}, virtualized: {container: {}}}}
 */
const getServerData = () => {
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

export default getServerData;
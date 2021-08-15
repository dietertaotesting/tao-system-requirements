import date from 'date-and-time';
import path from 'path';
import systemRequirements from "../data-provider/systemRequirements.js";

const getData = () => {
    const metaData = systemRequirements.getMetaData();
    const currentRelease = metaData.release[0].release;
    const api = metaData.api[0].release;
    const apiLastMod = metaData.api[0].lastMod;
    const vdData = metaData.viewportDevices.map(entry => entry.release);
    const releases = [];
    const lastMods = [];
    for (let [type, values] of Object.entries(metaData)) {
        values.forEach(entry => {
            if (entry.lastMod > apiLastMod) {
                lastMods.push(path.basename(entry.path))
            }
            if (type !== 'api' && type !== 'viewportDevices') {
                releases.push(entry.release);
            }
        })
    }
    const canBuild = vdData.includes(currentRelease) && Array.from(new Set(releases)).length === 1;
    const buildRequired = metaData.api[0].release !== currentRelease || lastMods.length;
    return {
        api,
        release: currentRelease,
        vdData,
        canBuild,
        buildRequired,
        lastMods,
        metaData
    }
}

const render = status => {
    const tblData = [];
    for (let [type, values] of Object.entries(status.metaData)) {
        for (let value of values) {
            value.type = type;
            value.lastMod = value.lastMod instanceof Date ? date.format(value.lastMod, 'YYYY-MM-DD HH:mm:ss') : value.lastMod;
            value.path = path.basename(value.path);
            // ignore older viewport data, they will be deleted during garbage collection
            if (type === 'viewportDevices' && value.release !== status.release) {
                continue;
            }
            tblData.push(value);
        }
    }
    console.table(tblData);
}


export default {
    render,
    getData
};
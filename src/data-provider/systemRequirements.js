import browser from './browser.js';
import server from './server.js';
import downloads from './downloads.js';
import viewportDevices from './viewport-devices.js';
import release from './tao-release.js';
import api from './api.js';

/**
 * Collect data from all other providers
 * @returns {{server: *, downloads: *, release: *, api, browsers: Array, viewportDevices: Set<*>}}
 */
const getData = () => {
    return {
        browsers: browser.getData(),
        viewportDevices: viewportDevices.getData(),
        server: server.getData(),
        downloads: downloads.getData(),
        release: release.getData(),
        api: api.getData()
    }
}

/**
 * Collect metadata from all other providers
 * @returns {{server: {path: `${string}/${string}.json`, release, lastMod: Date}[], downloads: {path: `${string}/${string}.json`, release, lastMod: Date}[], release: {path: string, release, lastMod: Date}[], api: {path: string, release: string, lastMod: string}[], browsers: Array, viewportDevices: Array}}
 */
const getMetaData = () => {
    return {
        api: api.getMetaData(),
        release: release.getMetaData(),
        viewportDevices: viewportDevices.getMetaData(),
        server: server.getMetaData(),
        downloads: downloads.getMetaData(),
        browsers: browser.getMetaData()
    }
}

export default {
    getMetaData,
    getData
}
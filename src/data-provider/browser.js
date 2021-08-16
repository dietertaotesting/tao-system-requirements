import browserslist from 'browserslist';
import oatBrowserListConfig from '@oat-sa/browserslist-config-tao';
import fs from 'fs-extra';
import paths from '../config/paths.json';

/**
 * Vocabulary to expand short codes for browsers and OSs to human readable names
 * @type {{ff: string, edge: string, chrome: string, safari: string, and: string, firefox: string, saf: string, chr: string, ios: string, ie: string}}
 */
const dictionary = {
    and: 'Android',
    chr: 'Chrome',
    ff: 'Firefox',
    ios: 'iOS',
    ie: 'Internet Explorer',
    saf: 'Safari',
    chrome: 'Chrome',
    edge: 'Edge',
    firefox: 'Firefox',
    safari: 'Safari'
}

/**
 * Converts the short codes to an object
 * @param {String} browser
 * @returns {{os: string, versions: [*], browser: string, device: string}}
 */
const format = browser => {
    const data = browser.split(' ')[0].split('_').reverse().map(part => dictionary[part] ? dictionary[part] : part);
    const device = data[1] && ['iOS', 'Android'].includes(data[1]) ? 'mobile' : 'desktop';
    const entry = {
        browser: data[0],
        os: data[1] || '',
        versions: [browser.split(' ')[1]],
        device: device
    }
    entry.label = entry.os ? entry.browser + '/' + entry.os : entry.browser;
    entry.versionStr = entry.versions.join(', ');
    entry.key = entry.label.toLowerCase().replace(/\W+/g, '-');
    return entry
}

/**
 * Convert browser data to an array
 * order: desktop -> mobile, then alphabetically, then version
 */
function getData() {
    const listing = {
        desktop: {},
        mobile: {}
    }
    browserslist(oatBrowserListConfig).reduce((list, browser) => {
        const key = browser.split(' ')[0];
        const formatted = format(browser);
        if (!listing[formatted.device][key]) {
            listing[formatted.device][key] = formatted;
        } else {
            listing[formatted.device][key].versions = listing[formatted.device][key].versions.concat(formatted.versions);
        }

        return listing;
    }, {});
    for (let device in listing) {
        for (let values of Object.values(listing[device])) {
            values.versions.sort();
        }
        Object.keys(listing[device]).sort().reduce(
            (obj, key) => {
                obj[key] = listing[device][key];
                return obj;
            }, {}
        );
    }
    return Object.values(listing['desktop']).concat(Object.values(listing['mobile']));
}

const getMetaData = () => {
    const data = fs.readJsonSync(`${paths.data.in}/browser-meta.json`);
    data.lastMod = new Date(data.lastMod);
    return [
        data
    ]
}

export default {
    getData,
    getMetaData
}
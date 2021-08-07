import screen from './screen.js';
import uaParser from 'ua-parser-js';
import tao from './tao.js';

/**
 * Retrieve information about the current environment
 * @returns {Object}
 */
const getEnv = () => {
    const uaData = uaParser(navigator.userAgent);

    Object.keys(uaData.device).map(key => {
        uaData.device[key] = uaData.device[key] || '';
    });
    return {
        ...{
            screen: {
                width: screen.getScreenWidth(),
                height: screen.getScreenHeight(),
                aspectRatio: screen.getAspectRatio(),
                orientation: screen.getOrientation()
            }
        },
        ...{
            tao: tao.getSetup(),
        },
        ...{
            browser: {
                name: uaData.browser.name,
                version: uaData.browser.major
            },
            device: uaData.device,
            os: uaData.os
        },
        ...{
            date: new Date()
        }
    }
}

export default {
    getEnv
}
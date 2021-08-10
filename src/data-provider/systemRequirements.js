import getBrowserData from "./browser.js"; 
import getServerData from "./server.js";
import getViewportDeviceData from "./viewport-devices.js";
import getRelease from "./tao-release.js";

const get = () => {
    return {
        browsers: getBrowserData(),
        viewportDevices: getViewportDeviceData(),
        server: getServerData(),
        version: getRelease()
    }
}

export default {
    get
}

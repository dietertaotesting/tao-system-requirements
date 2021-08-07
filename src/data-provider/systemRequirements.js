import getBrowserData from "./browser.js"; 
import getServerData from "./server.js";
import getViewportDeviceData from "./viewport-devices.js";
import getVersion from "./version.js";

const get = () => {
    return {
        browsers: getBrowserData(),
        viewportDevices: getViewportDeviceData(),
        server: getServerData(),
        version: getVersion()
    }
}

export default {
    get
}

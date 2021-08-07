import systemRequirements from '../data-provider/systemRequirements.js';
import fs from 'fs-extra';
import paths from '../config/paths.json';

/**
 * Build the JSON file
 */
const buildApi = () => {
    try {
        const requirements = systemRequirements.get();
        const version = requirements.version;

        fs.outputJson(`${paths.api.out}/system-requirements-${version}.json`, requirements);
        fs.outputJson(`${paths.api.out}/system-requirements-latest.json`, requirements);

        for(let [type, data] of Object.entries(requirements)){
            if(type === 'version'){
                continue;
            }
            fs.outputJson(`${paths.api.out}/${type}-${version}.json`, data);
            fs.outputJson(`${paths.api.out}/${type}-latest.json`, data);
        }
    } catch (e) {
        console.log(e);
    }
};

export default buildApi;

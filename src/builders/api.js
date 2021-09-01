import systemRequirements from '../data-provider/systemRequirements.js';
import fs from 'fs-extra';
import paths from '../config/paths.json';
import console from 'a-nicer-console';

/**
 * Build the API JSON files
 */
const buildApi = () => {
    try {
        const requirements = systemRequirements.getData();
        requirements.lastMod = new Date();
        const release = requirements.release;

        fs.outputJson(`${paths.api.out}/system-requirements-${release}.json`, requirements);
        fs.outputJson(`${paths.api.out}/system-requirements-latest.json`, requirements);

        for(let [type, data] of Object.entries(requirements)){
            if(['release','api', 'lastMod'].includes(type)){
                continue;
            }
            fs.outputJson(`${paths.api.out}/${type}-${release}.json`, data);
            fs.outputJson(`${paths.api.out}/${type}-latest.json`, data);
        }

        console.success(`Finished creating API for release ${release}.`);
    } catch (e) {
        console.error(`Process failed with message "${e}"`);
    }
};

export default buildApi;

import systemRequirements from '../data-provider/systemRequirements.js';
import fs from 'fs-extra';
import paths from '../config/paths.json';
import logger from '../modules/logger.js';

/**
 * Build the JSON file
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

        logger.success(`Finished creating API for release ${release}.`);
    } catch (e) {
        logger.error(`Process failed with message "${e}"`);
    }
};

export default buildApi;

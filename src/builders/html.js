import systemRequirements from '../data-provider/systemRequirements.js';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import paths from '../config/paths.json';
import _ from 'lodash';
import logger from '../modules/logger.js';


/**
 * Build the JSON file
 */
const buildHtml = () => {
    try {
        const data = systemRequirements.getData();
        const template = fs.readFileSync(paths.html.in, 'utf8');
        const renderTemplate = Handlebars.compile(template);
        const html = renderTemplate(data)
        fs.outputFile(paths.html.out, html);
        logger.success(`Finished creating website for release ${data.release}.`)
    } catch (e) {
        logger.error(`Process failed with message "${e}"`);
    }
};

export default buildHtml;
import systemRequirements from '../data-provider/systemRequirements.js';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import paths from '../config/paths.json';
import _ from 'lodash';


/**
 * Build the JSON file
 */
const buildHtml = () => {
    try {
        const template = fs.readFileSync(paths.html.in, 'utf8');
        const renderTemplate = Handlebars.compile(template);
        const html = renderTemplate(systemRequirements.get())
        fs.outputFile(paths.html.out, html);
    } catch (e) {
        console.log(e);
    }
};

export default buildHtml;
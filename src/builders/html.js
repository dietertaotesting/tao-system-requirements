import systemRequirements from '../data-provider/systemRequirements.js';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import paths from '../config/paths.json';
import console from 'a-nicer-console';


/**
 * Build the webpage
 */
const buildHtml = () => {
    try {
        const data = systemRequirements.getData();
        const template = fs.readFileSync(paths.html.in, 'utf8');
        const renderTemplate = Handlebars.compile(template);
        const html = renderTemplate(data)
        fs.outputFile(paths.html.out, html);
        console.success(`Finished creating website for release ${data.release}.`)
    } catch (e) {
        console.error(`Process failed with message "${e}"`);
    }
};

export default buildHtml;
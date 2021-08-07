import sass from 'sass';
import fs from 'fs-extra';
import datauri from 'datauri';
import paths from '../config/paths.json';

/**
 * Convert SCSS to CSS, but without the annoyances
 * 
 * @param {Object} options
 * @see https://sass-lang.com/documentation/js-api for signature
 * @returns {String}
 */
const convert = async options => {
    let css = sass.renderSync(options).css.toString()
        .replace(/\uFEFF/gu, '')
        .replace(/\\n/g, '');
    const matches = css.matchAll(/url\((?<img>[^\)]+)\)/g);
    for(let match of matches) {
        const imgDataUri = await datauri(`${paths.assets.in}/${match.groups.img}`);
        css = css.replace(new RegExp(match.groups.img), imgDataUri);
    }
    return css;
}

const buildCss = async () => {
    const css = await convert({data: fs.readFileSync(paths.css.in, 'utf8')});
    fs.outputFile(paths.css.out, css);
}



export default buildCss;
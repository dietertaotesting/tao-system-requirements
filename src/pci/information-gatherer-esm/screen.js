/**
 * Calculate the Greatest Common Divisor
 * @param {Number} a 
 * @param {Number} b 
 * @returns {Integer}
 */
const gcd = (a, b) => {
    a = Math.round(a);
    b = Math.round(b);
    return (b == 0) ? a : gcd(b, a % b);
}

/**
 * Retrieve the screen width
 * @returns {Integer}
 */
 const getScreenWidth = () => {
    return screen.width;
}

/**
 * Retrieve the screen height
 * @returns {Integer}
 */
const getScreenHeight = () => {
    return screen.height;
}

/**
 * Retrieve the screen orientation
 * @returns {String} 
 */
const getOrientation = () => {
    return getScreenWidth() >= getScreenHeight() ? 'Landscape' : 'Portrait';
}

/**
 * Calculate the aspect aspectRatio
 * @returns {String}
 */
const getAspectRatio = () => {
    const aspectRatio = gcd(getScreenWidth(), getScreenHeight());
    return `${getScreenWidth() / aspectRatio}:${getScreenHeight() / aspectRatio}`;
}

export default {
    getScreenWidth,
    getScreenHeight,
    getOrientation,
    getAspectRatio
}
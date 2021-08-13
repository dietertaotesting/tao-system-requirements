const getSetup = () => {

    const tr = document.querySelector('.test-runner-scope');

    /**
     * What is the version that has been tested?
     */
    const release = (() => {
        return document.querySelector('.tao-version').textContent;
    })();

    /**
     * Which test runner is in use?
     */
    const testRunner = (() => {
        const itemElem = document.querySelector('.qti-item');
        if(!itemElem){
            return 'Non-TAO'
        }
        const classes = Array.from(itemElem.classList);
        if(classes.some(entry => entry.startsWith('svelte'))) {
            return 'Solar';
        }
        if(classes.some(entry => entry.startsWith('tao-scope'))) {
            return 'Terre';
        }
        return 'Non-TAO'
    })();


    return {
        release,
        testRunner
    }
}

export default {
    getSetup
}
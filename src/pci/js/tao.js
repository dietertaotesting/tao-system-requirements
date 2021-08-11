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
        if(itemElem && itemElem.className.split(' ').some(entry => entry.trim().startsWith('svelte'))) {
            return 'Solar';
        }
        if(itemElem && itemElem.className.split(' ').some(entry => entry.trim().startsWith('tao-scope'))) {
            return 'Terre';
        }
        return 'nonTao'
    })();


    return {
        release,
        testRunner
    }
}

export default {
    getSetup
}
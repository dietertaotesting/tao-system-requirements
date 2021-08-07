import env from './modules/env.js';

const getDataField = () => {
    return document.querySelector('textarea');
}

const setData = () => {
    getDataField().value = JSON.stringify(env.getEnv());
}

window.addEventListener('orientationchange', setData);


setData();
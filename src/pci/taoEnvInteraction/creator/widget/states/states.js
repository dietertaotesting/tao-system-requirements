define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/states/states',
    'taoEnvInteraction/creator/widget/states/Question'
], function(factory, states){
    'use strict';
    return factory.createBundle(states, arguments, ['correct']);
});

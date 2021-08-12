define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'taoEnvInteraction/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var TaoEnvInteractionWidget = Widget.clone();

     TaoEnvInteractionWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return TaoEnvInteractionWidget;
});

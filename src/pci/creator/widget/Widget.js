define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'taoenvinfo/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var taoenvinfoWidget = Widget.clone();

     taoenvinfoWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return taoenvinfoWidget;
});

define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!taoEnvInteraction/creator/tpl/propertiesForm',
    'lodash',
    'jquery'
], function(stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl, _, $){
    'use strict';

    var taoEnvInteractionStateQuestion = stateFactory.extend(Question, function(){

        var Scontainer = this.widget.$container,
            Sprompt = Scontainer.find('.prompt'),
            interaction = this.widget.element;

        containerEditor.create(Sprompt, {
            change : function(text){
                interaction.data('prompt', text);
                interaction.updateMarkup();
            },
            markup : interaction.markup,
            markupSelector : '.prompt',
            related : interaction
        });

        simpleEditor.create(Scontainer, '.label-min', function(text){
            interaction.prop('label-min', text);
        });

        simpleEditor.create(Scontainer, '.label-max', function(text){
            interaction.prop('label-max', text);
        });

    }, function(){

        var Scontainer = this.widget.$container,
            Sprompt = Scontainer.find('.prompt');

        simpleEditor.destroy(Scontainer);
        containerEditor.destroy(Sprompt);
    });

     taoEnvInteractionStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            Sform = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration(),
            level = parseInt(interaction.prop('level')) || 5,
            levels = [5, 7, 9],
            levelData = {};

        //build select option data for the template
        _.each(levels, function(lvl){
            levelData[lvl] = {
                label : lvl,
                selected : (lvl === level)
            };
        });

        //render the form using the form template
        Sform.html(formTpl({
            serial : response.serial,
            levels : levelData,
            identifier : interaction.attr('responseIdentifier')
        }));

        //init form javascript
        formElement.initWidget(Sform);

        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            level : function level(interaction, value){

                //update the pci property value:
                interaction.prop('level', value);
                
                //trigger change event:
                interaction.triggerPci('levelchange', [parseInt(value)]);
            },
            identifier : function(i, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });

    };

    return  taoEnvInteractionStateQuestion;
});

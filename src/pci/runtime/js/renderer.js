define(['IMSGlobal/jquery_2_1_1', 'OAT/util/html'], function($, html){
    'use strict';

    var dataImport =  [];        
    var stay = 2000; // delay Bot dialog default value
    var chatBoxOn = false; // Controle ChatBox opener 
    var resumeLib=[];//for resume
    var timeSystem, timeActor, timeIntro, timeDesti, timeTimer, timeEnvoy, timeDisplay; // To controle  setTimeOut for suppression
    var respons = [];
    var lastNodeTracer;
    var firstName='';
    

  function getResume(node, container) {
      for (var i = 0; i < dataImport.length; i++) {
          if (dataImport[i][node]) {
              if (resumeLib.indexOf(node) === -1) { // Neutralize doubles.
                  addToArray(resumeLib, node);
                  $(container).find('.accordionBox').append('<div class="btAccordion">' + insertFname(dataImport[i][node].title) + '</div><div class="AccordionContent">' + insertFname(dataImport[i][node].resume) + '</div>');
              } 
          }
      }
  }

  function addToArray(array, value) {
      if (array.indexOf(value) === -1) {
          array.push(value);
      }
  }

   function getAllNodeId(){
    var allNodes=[];
    for (var i = 0; i < dataImport.length; i++) {
        allNodes.push( String(Object.keys(dataImport[i])));
    }
    return allNodes;
   }

    function getActors(){
         var actors=[];
         var allNodeId = getAllNodeId();
         for (var j = 0; j < allNodeId.length; j++) {
              for (var i = 0; i < dataImport.length; i++) {
                if(dataImport[i][allNodeId[j]]){
                    if(dataImport[i][allNodeId[j]].nodetype == 'bot' && !(dataImport[i][allNodeId[j]].actor=='System') ){
                    if(!(actors.includes(dataImport[i][allNodeId[j]].actor))){ actors.push(dataImport[i][allNodeId[j]].actor);}
                    }
                }   
            }
        }   
        return actors;
    }


    function getJsonData(node){
       var nodeData;
        for (var i = 0; i < dataImport.length; i++) {
            if(dataImport[i][node]){
                if(dataImport[i][node].nodeId == node){
                nodeData = dataImport[i];
                }
            }   
        }
       return nodeData;
    }

    function intro(container){
       var nodeData = getJsonData('root'); 
         // Prepare intro : 
       var AButton = nodeData.root.callButton;
       var AbuttonLabel = nodeData.root.callButtonLabel;
       var ATimer = nodeData.root.timer;
       var Adelay = nodeData.root.delay;
       var Adesti = nodeData.root.desti[0];
       var Atitle = nodeData.root.title;
       var AContent = nodeData.root.html;
       var Acss = nodeData.root.css;
       var AJs = nodeData.root.js;
       var AnodeId = nodeData.root.nodeId;

        //call js addition function
      
        $(container).find('.globWrapper').html(
            '<div class="SQContainer"><div class="SQTitre">'+Atitle+'</div><div class="SQContent">'+AContent+'</div><button class="desti">'+AbuttonLabel+'</button></div>');
        if(AButton === false){$(container).find(".desti").hide();} // Destination button must disappear if no label
            else{$(container).find('.desti').click(function(event) {
                firstName = setFname(container);
                displayer(Adesti, container);
            });}

            if(ATimer === true){
                timeDesti = setTimeout(function(){ 
                    firstName = setFname(container);
                    displayer(Adesti, container);  }, Adelay*1000);
            }
        getResume('root', container);
    }

    function displayer(node , container){
       var nodeData = getJsonData(node) ;
       //Node Type identification : 
       var nodeType = nodeData[node].nodetype;
       var AButton, AbuttonLabel, ATimer, Adelay, Adesti, Atitle, AContent, Acss, AJs, AActor,AsubType,AnodeId;
       var fanSetOn = false;
       var leftBox = $(container).find('.fridge .leftBox');
       var Gwrapp = $(container).find('.globWrapper'); //
       
       // Displayer choices : ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       if(nodeType == 'SQTxt'){
         chatBoxOn = false;
         AButton = nodeData[node].callButton;
         AbuttonLabel = nodeData[node].callButtonLabel;
         ATimer = nodeData[node].timer;
         Adelay = nodeData[node].delay;
         Adesti = nodeData[node].desti[0];
         Atitle = nodeData[node].title;
         AContent = nodeData[node].html;
         Acss = nodeData[node].css;
         AJs = nodeData[node].js;
         AsubType = nodeData[node].subType;
         AnodeId = nodeData[node].nodeId;

         //appel de la fonction js additionnel
        

        $(container).find('.globWrapper').html(
            '<div class="SQContainer"><div class="SQTitre">'+insertFname(Atitle)+'</div><div class="SQContent">'+insertFname(AContent)+'</div><div class="btDiv"><button class="desti">'+AbuttonLabel+'</button></div></div>');
        
         if(AButton === false){$(container).find(".desti").hide();} //  Desti button dispear if empty

        if(AsubType == 'Transition'){ $(container).find('.SQContainer').css({'float':'left', 'width':'450px', 'border':'1px grey solid'});}
        $('.desti').click(function(event) {
            firstName = setFname(container);
            clearTimeout(timeTimer);
           if(AsubType == 'Conclusion' || AsubType == 'Introduction' )
            {$(container).find('.SQContainer').remove();}
           $(container).find(this).hide();
            displayer(Adesti, container);//OK
        });

        if(ATimer === true){
            timeTimer = setTimeout(function(){ 
                if(AsubType == 'Conclusion' || AsubType == 'Introduction' )
                {$(container).find('.SQContainer').remove();}
                $(container).find(this).hide();
                firstName = setFname(container);
                displayer(Adesti, container); //OK 
            }, Adelay*1000);
        }

        //Résumé ! 
        if(AsubType == 'Introduction' || AsubType == 'Transition'){
            getResume(node, container);}
       }

       if(AsubType == "Conclusion"){ // replacec button for preview mode
            $(container).find(".lastNode").html(AnodeId);
            preparRespons(container);
            $(container).find('.SQContainer button').hide();    
           
        }

       if(nodeType == 'bot'){
        AActor = nodeData[node].actor;
        Adelay = nodeData[node].delay;
        Adesti = nodeData[node].desti[0];
        AContent = nodeData[node].html;
        AJs = nodeData[node].js;
        AnodeId = nodeData[node].nodeId; // PCI Specific
        
         //BOT Call additional JS function
         
    
         $(container).find('.desti').hide();
         $(container).find('.SQContainer').remove();

        // Is chatBOx open ?
            if(chatBoxOn){
                //Bot dialog injection
                //Bot Dialog
                timeTimer = setTimeout(function(){ 
                renderBotRepliq(Gwrapp, AActor,AContent,Adelay, Adesti, container);}, 2000);
            }
            else{  
                chatBoxOn = true; // ChatBox is now open
               // Install actor list
                var actors = getActors();
                var actorList = "";
                for (var i = 0; i < actors.length; i++) {
                    if( actors[i] !== "Vous" && actors[i] !== "vous"){ actorList = actorList + ", " + actors[i];}
                } 
                actorList = 'Vous' + actorList;
                 leftBox.find('.actorList').html(actorList);
                 //Display leftBox  
                var chatDiva =  leftBox.find('.chatBox').clone(); 
                $(container).find('.globWrapper').prepend(
                    '<div class="leftBoxClone"><div class="accordionclone"></div><div class="chatDiv"></div><div class="repDiv"></div></div>');
                $(container).find('.accordionBox').clone().prependTo('.accordionclone');
                renderHisto(container);
                
                $(container).find('.globWrapper .chatDiv').html(chatDiva);
                
                  
                //Bot Dialog
                timeTimer = setTimeout(function(){ 
                renderBotRepliq(Gwrapp, AActor,AContent,Adelay, Adesti, container);}, 3000);
            }
       }

       if(nodeType == 'Fanset'){
         
         Adesti = nodeData[node].desti;
         AContent = nodeData[node].html;
         //Answers
         // Install answerSet element
        var answBox = leftBox.find('.ansGroup').clone();
         if($(container).find('.globWrapper .leftBoxClone .repDiv')){
            $(container).find('.globWrapper .leftBoxClone .repDiv').html(answBox); 
         }
         else{$(container).find('.globWrapper .leftBoxClone .repDiv').append(answBox);

            }

        for (var i = 0; i < Adesti.length; i++) {
            var propos = getPropContent(Adesti[i]);
            var destina = getPropDesti(Adesti[i]);
            $(answBox).find('.prop'+(i+1)).html(propos);
            if(Adesti.length==2){ $(container).find('.prop3').hide(); $(container).find('.prop4').hide();}
            if(Adesti.length==3){ $(container).find('.prop4').hide();}

            $(answBox).find('.prop'+(i+1)).attr('data',destina);
        }
        
        // Install answerSet command
        renderDialogChoices($(container).find('.leftBoxClone'), Adesti, node, container); 
       }

       if(nodeType == 'IDoc'){
         $(container).find(".SQContainer").remove();
         AButton = nodeData[node].callButton;
         AbuttonLabel = nodeData[node].callButtonLabel;
         ATimer = nodeData[node].timer;
         Adelay = nodeData[node].delay;
         Adesti = nodeData[node].desti[0];
         Atitle = nodeData[node].title;
         AContent = nodeData[node].html;
         Acss = nodeData[node].css;
         AJs = nodeData[node].js;
         AnodeId = nodeData[node].nodeId;
         
         //call additionnal js function - PCI specific.
         
         var IDocContainer = $(container).find('.globWrapper').find('.IDocWrapper');
            if(IDocContainer.length == 0){
                $(container).find('.globWrapper').append(
                '<div class="IDocWrapper"><span class="SQTitre">' + 
                insertFname(Atitle) +'</span><div class="IDocContent">'+insertFname(AContent)+'</div>');
                $(container).find('.IDocWrapper').append('</div><div class="btDiv"><button class="desti">'+AbuttonLabel+'</button></div>');
                $(container).find(".desti").click(function(event) {
                displayer(Adesti, container);//OK
                });
            } 
            else{ 
               
                $(container).find('.IDocWrapper').html('<span class="SQTitre">'+ insertFname(Atitle) +'</span>'+ insertFname(AContent) + '<div class="btDiv"><button class="desti">'+AbuttonLabel+'</button></div>');
                $(container).find('.desti').click(function(event) {
                displayer(Adesti, container);//OK
                });}

            if(AbuttonLabel == ''){$(container).find('.desti').hide();}

            if(ATimer === true){
                timeTimer = setTimeout(function(){ 
                    displayer(Adesti, container); //OK 
                }, Adelay*1000);
            } 

        }

    }

    function getPropContent(nodeProp){
        var nodeData = getJsonData(nodeProp) ;
        var proposition = nodeData[nodeProp].answerContent;
        return proposition;
    }

    function getPropDesti(nodeProp){
        var nodeData = getJsonData(nodeProp) ;
        var desti = nodeData[nodeProp].desti;
        return desti;
    }
 
    function renderBotRepliq(lBox, actor ,repliq, delay, desti, container){
        var specialDesti;
        var messageStyle;
        if(!delay){delay=0;}
        var delax = parseInt(delay) * 1000;
        var dipiu = parseInt(delay) + 3000;  // Variable d'ajustement du temps pour les non Bots !
        stay = delax + stay;
        if(specialDesti == -1){dipiu = 5000;}
        if(actor == 'System'){
            messageStyle = 'dialogLi system arriving';
            timeSystem =  setTimeout(function(){
             lBox.find('.dialogUl').append('<li class="'+messageStyle+'">'+insertFname(repliq)+'</li>');
              if ($(container).find('.chatRoom')){ $(container).find('.chatRoom').scrollTop($(container).find('.chatRoom')[0].scrollHeight);}               
          }, 1000);
        lBox.find('.dialogLi').removeClass('arriving');
        timeDesti = setTimeout(function(){
            displayer(desti, container);//OK
             if ($(container).find('.chatRoom')){ $(container).find('.chatRoom').scrollTop($(container).find('.chatRoom')[0].scrollHeight);}
        }, 5000 + dipiu);
        }
        else{
            messageStyle ='dialogLi arriving';
            
             lBox.find('.dialogUl').append('<li class="'+messageStyle+'"><span class="actorlabel">'+actor +'</span> : '+insertFname(repliq)+'</li>'); 
             if ($(container).find('.chatRoom')){ $(container).find('.chatRoom').scrollTop($(container).find('.chatRoom')[0].scrollHeight);}               
          timeActor = setTimeout(function(){ lBox.find('.dialogLi').removeClass('arriving');}, 3000);
       
        timeDesti = setTimeout(function(){
            displayer(desti, container);//OK
            if ($(container).find('.chatRoom')){ $(container).find('.chatRoom').scrollTop($(container).find('.chatRoom')[0].scrollHeight);}
        }, stay + dipiu);
        }  
    }

    function renderDialogChoices(lbox, setAnsw, node, container){

          $(container).find(".proposiAfter").removeClass('proposiAfter').addClass('proposi'); //Cleaning Restart

         lbox.find('.prop1').click(function(event) {
             lbox.find('.selected').removeClass('selected').addClass('proposi');
             $(container).find(this).addClass('selected').removeClass('proposi');
         });
         lbox.find('.prop2').click(function(event) {
             lbox.find('.selected').removeClass('selected').addClass('proposi');
             $(container).find(this).addClass('selected').removeClass('proposi');
         });
         lbox.find('.prop3').click(function(event) {
             lbox.find('.selected').removeClass('selected').addClass('proposi');
             $(container).find(this).addClass('selected').removeClass('proposi');
         });
         lbox.find('.prop4').click(function(event) {
             lbox.find('.selected').removeClass('selected').addClass('proposi');
             $(container).find(this).addClass('selected').removeClass('proposi');
         });

         lbox.find('.envoy').click(function(event) {
            if($(container).find('.selected').attr('data')){ 
                    var ansNumber = String($(container).find('.selected').attr("class"));
                    ansNumber = String(ansNumber.match(/\d/g));
                    ansNumber = ansNumber -1;

                respons.push(setAnsw[ansNumber]);//Stock response node.
                timeEnvoy = setTimeout(function(){   
                        lbox.find('.dialogUl').append('<li class="dialogLi arriving"><span class="actor">Moi :</span>'+lbox.find('.selected').html()+'</li>');
                        if ($(container).find('.chatRoom')){ $(container).find('.chatRoom').scrollTop($(container).find('.chatRoom')[0].scrollHeight);}
                    }, 500);
               timeDisplay = setTimeout(function(){displayer($(container).find('.selected').attr('data'), container);},3500);//OK
               $(container).find(this).hide();
               $(container).find('.proposi').removeClass('proposi').addClass('proposiAfter');
               lbox.find('.prop1').unbind('click');
               lbox.find('.prop2').unbind('click');
               lbox.find('.prop3').unbind('click');
               lbox.find('.prop4').unbind('click');
            } 
         });
    }

    function preparRespons(container){
        getSemanticCat(container);
        $(container).find(".respNode").html(respons.join(","));
        $(container).find(".lastNode").html(lastNodeTracer);    
    }


    function getSemanticCat(container){     
            for (var y = 0; y < respons.length; y++) {
                for (var i = 0; i < dataImport.length; i++) {
                if(dataImport[i][respons[y]]){          
                    $(container).find(".respCatSem").append(dataImport[i][respons[y]].semantic + ",");
                }
            }
        }
    }

    function renderHisto(container){
    $(container).find('.AccordionContent').slideUp(); 
    $(container).find('.btAccordion').click(function(event) {
        var targetSlider = $(container).find(this).next();
           $(container).find(targetSlider).slideToggle();
       });
    }

    function installTemplate(container){
        $(container).append("<div class='fridge'> <div class='headBar'></div> <div class='leftBox' > <div class='accordionBox'> </div> <div class='chatDiv'> <div class='chatBox'> <div class='participants'> Participants au chat <div class='actorList'> Vous </div> </div> <div class='chatRoom'> <ul class='dialogUl'> </ul> </div> </div> </div> <div class='repDiv'> <div class='ansGroup'> Vous : <div class='propositions'> <div class='proposi prop1'>Proposition 1</div> <div class='proposi prop2'>Proposition 2</div> <div class='proposi prop3'>Proposition 3</div> <div class='proposi prop4'>Proposition 4</div> </div> <div class='propSender'> <div class='envoy'>envoyer</div> </div> </div> </div> </div> <div class='IDocWrapper'> Ici le doc interactif. </div> </div> <div class='respNode hiddenRep'></div> <div class='respCatSem hiddenRep'></div> <div class='lastNode hiddenRep'></div>");
    }

function insertFname(stringos){
  var rest = stringos.replace(/_Fname_/g , firstName);
  return rest;
}

function setFname(container){
  var Fnamer;
  if($(container).find("[name='Fname']").length > 0){Fnamer = $(container).find("[name='Fname']").val();}
  else {Fnamer = firstName;}
  return Fnamer ; 
 }

    

    return {
        render : function(id, container, config, assetManager){

            var $container = $(container);
            installTemplate(container);
            intro(container);
            //render rich text content in prompt
            html.render($container.find('.prompt'));
        },
        renderChoices : function(id, container, config){
            renderChoices(id, $(container), config);
        }
    };
});
 
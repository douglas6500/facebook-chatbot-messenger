var login = require("facebook-chat-api");
var aimlInterpreter = require('aimlinterpreter');

var aimlInterpreter = new aimlInterpreter(
  {name:'Claude'},
  {age: '26'},
  {website:'truc'}
);

aimlInterpreter.loadAIMLFilesIntoArray(['./dialogs/french_aiml_publish/atomique_ed.aiml','./dialogs/french_aiml_publish/comment_ed.aiml']);
//,'./dialogs/french_aiml_publish/comment_ed.aiml','./dialogs/french_aiml_publish/estu_ed.aiml','./dialogs/french_aiml_publish/humour_ed.aiml','./dialogs/french_aiml_publish/ou_ed.aiml','./dialogs/french_aiml_publish/pourquoi_ed.aiml','./dialogs/french_aiml_publish/quand_ed.aiml','./dialogs/french_aiml_publish/quel_ed.aiml','./dialogs/french_aiml_publish/questceque_ed.aiml','./dialogs/french_aiml_publish/qui_ed.aiml','./dialogs/french_aiml_publish/srai_ed.aiml','./dialogs/french_aiml_publish/that_ed.aiml']);

var callback = function(answer, wildCardArray, input){
    console.log(answer + ' | ' + wildCardArray + ' | ' + input);
    sendMessage(answer);
};

var fbanswer;
function sendMessage(message) {
    fbanswer = message;
}

//aimlInterpreter.findAnswerInLoadedAIMLFiles('What is your name?', callback);
function sendAIMLMessage(message){
  aimlInterpreter.findAnswerInLoadedAIMLFiles(message, callback);
}

// Create simple echo bot
login({email: "xxx@mail.com", password: "abc123"}, function callback (err, api) {
if(err) return console.error(err);

    api.setOptions({listenEvents: true});

    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);

        switch(event.type) {
          case "message":
            if(event.body === '/stop') {
              api.sendMessage("Goodbye...", event.threadID);
              return stopListening();
            }
            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });
            console.log(event.body);
            //api.sendMessage("TEST BOT: " + event.body, event.threadID);
            sendAIMLMessage(event.body);//because it has a callback function
            api.sendMessage(fbanswer, event.threadID);
            break;
          case "event":
            console.log(event);
            break;
        }
    });
});

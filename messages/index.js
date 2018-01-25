var builder = require('botbuilder');
require('dotenv').config();
var botbuilder_azure = require('botbuilder-azure');
// var Vera = require('./Vera');

// const vera = new Vera();

var connector = new botbuilder_azure.BotServiceConnector({
  appId: process.env['MicrosoftAppId'],
  appPassword: process.env['MicrosoftAppPassword'],
  openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

// var recognizer = new builder.LuisRecognizer(
//   ''
// );
// bot.recognizer(recognizer);

// bot
//   .dialog('ControlLights', [
//     function(session, args, next) {
//       // session.send('OK! One sec...');

//       var location = builder.EntityRecognizer.findEntity(
//         args.intent.entities,
//         'Location'
//       );

//       var lightState = builder.EntityRecognizer.findEntity(
//         args.intent.entities,
//         'Light State'
//       );

//       // got both location and light state, move on to the next step
//       if (location && lightState) {
//         session.dialogData.location = location.entity;
//         next({
//           location: location.entity,
//           lightState: lightState.entity
//         });
//       }

//       // got a location, but no light state
//       if (!location || !lightState) {
//         session.dialogData.location = location;
//         builder.Prompts.text(
//           session,
//           `I need to know which room and if you want the lights on or off. You can say things like, "Turn on/off the kitchen lights".`
//         );
//       }
//     },
//     function(session, results) {
//       var location = results.location;
//       var lightState = results.lightState;
//       controlLights(session, location, lightState);
//     }
//   ])
//   .triggerAction({
//     matches: 'Control Lights'
//   });

// bot
//   .dialog('Help', session => {
//     session.endDialog(
//       `I can turn lights on or off in any room. You can say things like, "Turn off the lights in the kitchen".`
//     );
//   })
//   .triggerAction({
//     matches: 'Help'
//   });

// bot
//   .dialog('Greeting', session => {
//     session.endDialog('Sup, yo!');
//   })
//   .triggerAction({
//     matches: 'Greeting'
//   });

// Main dialog with LUIS
const recognizer = new builder.LuisRecognizer(process.env['LuisModelUrl']);
const intents = new builder.IntentDialog({ recognizers: [recognizer] })
  .matches('Greeting', session => {
    session.send('Sup, yo!');
  })
  .matches('Help', session => {
    session.send(
      'I can control the lights in your house. You can say things like, "Turn the kitchen lights on".'
    );
  })
  .matches('Cancel', session => {
    session.send('OK. Canceled.');
    session.endDialog();
  })
  .matches('Control Lights', (session, args) => {
    session.send('OK! One sec...');

    var location = builder.EntityRecognizer.findEntity(
      args.entities,
      'Location'
    );

    var lightState = builder.EntityRecognizer.findEntity(
      args.entities,
      'Light State'
    );

    // got both location and light state, move on to the next step
    if (location && lightState) {
      controlLights(session, location.entity, lightState.entity);
    }

    // got a location, but no light state
    if (!location || !lightState) {
      session.dialogData.location = location;
      builder.Prompts.text(
        session,
        `I need to know which room and if you want the lights on or off. You can say things like, "Turn on/off the kitchen lights".`
      );
    }
  })
  /*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
  .onDefault(session => {
    session.send("Sorry, I did not understand '%s'.", session.message.text);
  });

bot.dialog('/', intents);

function controlLights(session, location, lightState) {
  session.send(`${location} lights are ${lightState}`);
  session.endDialog();
}

module.exports = connector.listen();

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

var bot = new builder.UniversalBot(connector, session => {
  session.send(`Sorry, I did not understand "${session.message.text}"`);
});

var recognizer = new builder.LuisRecognizer(
  'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/160b0864-1ba8-4aee-a337-b8c77695fc9f?subscription-key=19d29a12d3fc4d9084146b466638e62a&verbose=true&timezoneOffset=0&q='
);
bot.recognizer(recognizer);

bot
  .dialog('ControlLights', [
    function(session, args, next) {
      // session.send('OK! One sec...');

      var location = builder.EntityRecognizer.findEntity(
        args.intent.entities,
        'Location'
      );

      var lightState = builder.EntityRecognizer.findEntity(
        args.intent.entities,
        'Light State'
      );

      // got both location and light state, move on to the next step
      if (location && lightState) {
        session.dialogData.location = location.entity;
        next({
          location: location.entity,
          lightState: lightState.entity
        });
      }

      // got a location, but no light state
      if (!location || !lightState) {
        session.dialogData.location = location;
        builder.Prompts.text(
          session,
          `I need to know which room and if you want the lights on or off. You can say things like, "Turn on/off the kitchen lights".`
        );
      }
    },
    function(session, results) {
      var location = results.location;
      var lightState = results.lightState;
      controlLights(session, location, lightState);
    }
  ])
  .triggerAction({
    matches: 'Control Lights'
  });

bot
  .dialog('Help', function(session) {
    session.endDialog(
      `I can turn lights on or off in any room. You can say things like, "Turn off the lights in the kitchen".`
    );
  })
  .triggerAction({
    matches: 'Help'
  });

function controlLights(session, location, lightState) {
  session.send(`${location} lights are ${lightState}`);

  session.endDialog();
}

module.exports = connector.listen();

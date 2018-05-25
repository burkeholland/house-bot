const builder = require('botbuilder');
const botbuilder_azure = require('botbuilder-azure');
const LIFX = require('lifx-http-api');

require('dotenv').config();

const FRIENDLY_ERROR = 'No dice. An error was returned by the LIFX API.';

const client = new LIFX({
  bearerToken: process.env.LIFX_TOKEN
});

const connector = new botbuilder_azure.BotServiceConnector({
  appId: process.env['MicrosoftAppId'],
  appPassword: process.env['MicrosoftAppPassword'],
  openIdMetadata: process.env['BotOpenIdMetadata']
});

const bot = new builder.UniversalBot(connector);

const luisModelUrl = `https://${
  process.env['LuisAPIHostName']
}/luis/v2.0/apps/${process.env['LuisAppId']}?subscription-key=${
  process.env['LuisAPIKey']
}`;

// Main dialog with LUIS
const recognizer = new builder.LuisRecognizer(luisModelUrl);
const intents = new builder.IntentDialog({ recognizers: [recognizer] })
  .matches('Greeting', session => {
    session.send(
      `Hi there. I'm the Lamp Bot. Built by Burke - the smartest human in the world. 🧠`
    );
  })
  .matches('Thank You', session => {
    session.send(
      'My pleasure. Burke built me and he is incredibly smart so really you should be thanking him.'
    );
  })
  .matches('Help', session => {
    session.send(
      'I can control your LIFX lightbulb. You can say things like "Turn the light on" or "set it to blue".'
    );
  })
  .matches('Cancel', session => {
    session.send('OK. Canceled.');
    session.endDialog();
  })
  .matches('Power', (session, args) => {
    var power = builder.EntityRecognizer.findEntity(args.entities, 'Power');

    let options = { power: power.entity };
    setState(options)
      .then(result => {
        session.send(`OK. The lamp is ${power.entity}.`);
      })
      .catch(err => {
        session.send(err);
      });
  })
  .matches('Color', (session, args) => {
    let namedColor = builder.EntityRecognizer.findEntity(
      args.entities,
      'Color:Named'
    );

    let hexColor = builder.EntityRecognizer.findEntity(
      args.entities,
      'Color:Hex'
    );

    let options = {};

    if (namedColor || hexColor) {
      if (namedColor) {
        options.color = namedColor.entity;
      }
      if (hexColor) {
        options.color = hexColor.entity;
      }

      setState(options)
        .then(result => {
          session.send(`OK. Lamp color is now ${options.color}.`);
        })
        .catch(err => {
          session.send(err);
        });
    } else {
      session.send(
        `I think you want to change the color of the lamp, but I couldn't figure out which color you want to change it to. Please try again?`
      );
    }
  })
  .onDefault(session => {
    session.send("Sorry, I did not understand '%s'.", session.message.text);
  });

bot.dialog('/', intents);

/* Color Change Function */
function setState(options) {
  return client.setState('all', options);
}

module.exports = connector.listen();

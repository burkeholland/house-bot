const builder = require('botbuilder');
const botbuilder_azure = require('botbuilder-azure');
const LIFX = require('lifx-http-api');

require('dotenv').config();

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
    session.send('Sup, yo!');
  })
  .matches('Thank You', session => {
    session.send('No problem! Glad I could help.');
  })
  .matches('Help', session => {
    session.send(
      'I can control your LIFX lightbulb. You can say things like "Turn the light on and set it to blue".'
    );
  })
  .matches('Cancel', session => {
    session.send('OK. Canceled.');
    session.endDialog();
  })
  .matches('SetState', (session, args) => {
    session.send('One sec...');

    var colorEntity = builder.EntityRecognizer.findEntity(
      args.entities,
      'Color'
    );
    var powerEntity = builder.EntityRecognizer.findEntity(
      args.entities,
      'Power'
    );

    // if we have a color or power value, make sure there is no whitespace
    if (colorEntity || powerEntity) {
      let options = {
        power: powerEntity ? powerEntity.entity.replace(/ /g, '') : undefined,
        color: colorEntity ? colorEntity.entity.replace(/ /g, '') : undefined
      };
      setState(session, options);
    } else {
      // No entities were matched
      session.send(
        `I dind't understand that. You can ask me to turn the light on/off or change the color.`
      );
    }
  })
  .onDefault(session => {
    session.send("Sorry, I did not understand '%s'.", session.message.text);
  });

bot.dialog('/', intents);

/* Light Functions */
function setState(session, options) {
  client.setState('all', options).then(() => {
    session.send(`${JSON.stringify(options)}`);
  });
}

module.exports = connector.listen();

// import the bot service libraries for Azure
const builder = require('botbuilder');
const botbuilder_azure = require('botbuilder-azure');

require('dotenv').config();

// get configuration values from environment variables
let { MicrosoftAppId, MicrosoftAppPassword, BotOpenIdMetadata } = process.env;

// the connector is what allows the bot to communicate
const connector = new botbuilder_azure.BotServiceConnector({
  appId: MicrosoftAppId,
  appPassword: MicrosoftAppPassword,
  openIdMetadata: BotOpenIdMetadata
});

// this is the bot. there is only a universal bot, which covers all types of bots.
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
  .onDefault(session => {
    session.send("Sorry, I did not understand '%s'.", session.message.text);
  });

// start the root dialog
bot.dialog('/', intents);

module.exports = connector.listen();

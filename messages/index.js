const builder = require('botbuilder');
const botbuilder_azure = require('botbuilder-azure');

require('dotenv').config();

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
const intents = new builder.IntentDialog({
  recognizers: [recognizer]
}).onDefault((session, args) => {
  if (args.score > 0.3) {
    let Intent = require(`./intents/${args.intent}`);
    let intent = new Intent(session, args, builder);
    intent.process();
  }
});

bot.dialog('/', intents);

module.exports = connector.listen();

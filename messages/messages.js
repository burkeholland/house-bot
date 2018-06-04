module.exports = {
  intents: {
    Greeting: [
      `Hi there. I'm the Lamp Bot. Built by Burke - the smartest human in the world 🧠`,
      `Well hello there!`,
      `Hi!`,
      `Sup, yo!`,
      `OH HAI`,
      `How do you do?`
    ],
    Help: [
      `I can control Burke's LIFX connected bulb. You can say things like "Turn the lamp off" or "change the color to blue".`,
      `I know a few commands, like how to turn Burke's lamp on and off, as well as change the color. The color supports some named colors and any hex value. If you get it wrong, I'll tell you. 😉`
    ],
    ThankYou: [
      `You're Welcome. I mean, I'm a robot so it's not like I really have a choice.`,
      `Whatever. You don't care about me.`,
      `No problem! 👍`,
      `"You got it, dude" 
      - An Olson Twin. Full House.`
    ],
    ColdStart: [
      `Patience is a virtue.`,
      `Good things take time.`,
      `It's not a race. You can wait 5 seconds.`,
      `Relax. Nobody ever died from a cold start.`
    ]
  },

  getByIntent(intent) {
    // returns a random message from the messages list
    let list = this.intents[intent];
    let index = Math.floor(Math.random() * (list.length - 1));

    return list[index];
  }
};

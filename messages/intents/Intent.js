let messages = require('../messages');

class Intent {
  constructor(session, args, builder) {
    this.session = session;
    this.messages = messages;
    this.args = args;
    this.builder = builder;
  }
}

module.exports = Intent;

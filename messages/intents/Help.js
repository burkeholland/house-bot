let Intent = require('./Intent');

class Help extends Intent {
  process() {
    let message = this.messages.getByIntent('Help');
    this.session.send(message);
  }
}

module.exports = Help;

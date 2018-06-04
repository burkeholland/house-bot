let Intent = require('./Intent');

class ColdStart extends Intent {
  process() {
    let message = this.messages.getByIntent('ColdStart');
    this.session.send(message);
  }
}

module.exports = ColdStart;

let Intent = require('./Intent');

class Cancel extends Intent {
  process() {
    let message = this.messages.getByIntent('Cancel');
    this.session.send(message);
    this.session.endDialog();
  }
}

module.exports = Cancel;

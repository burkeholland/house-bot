let Intent = require('./Intent');

class ThankYou extends Intent {
  process() {
    let message = this.messages.getByIntent('ThankYou');
    this.session.send(message);
  }
}

module.exports = ThankYou;

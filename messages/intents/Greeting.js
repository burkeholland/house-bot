let Intent = require('./Intent');

class Greeting extends Intent {
  process() {
    let message = this.messages.getByIntent('Greeting');
    this.session.send(message);
  }
}

module.exports = Greeting;

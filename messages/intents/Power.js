let Intent = require('./Intent');
let lifx = require('../lifx');

class Power extends Intent {
  process() {
    let power = this.builder.EntityRecognizer.findEntity(
      this.args.entities,
      'Power'
    );

    let options = { power: power.resolution.values[0] };
    lifx
      .setState(options)
      .then(result => {
        this.session.send(`OK. The lamp is ${options.power}.`);
      })
      .catch(err => {
        this.session.send(err);
      });
  }
}

module.exports = Power;

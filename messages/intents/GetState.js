let Intent = require('./Intent');
let lifx = require('../lifx');
let hsl = require('hsl-to-hex');

class GetState extends Intent {
  process() {
    lifx
      .listLights()
      .then(results => {
        results.forEach(result => {
          let hex = hsl(result.color.hue, 100 / result.color.saturation, 50);

          this.session.send(
            `${result.label} power is ${
              result.power
            } and the color is currently ${hex}`
          );
        });
      })
      .catch(err => {
        this.session.send(err.message);
      });
  }
}

module.exports = GetState;

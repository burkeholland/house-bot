let Intent = require('./Intent');
let lifx = require('../lifx');

class Color extends Intent {
  process() {
    let namedColor = this.builder.EntityRecognizer.findEntity(
      this.args.entities,
      'Color:Named'
    );
    let hexColor = this.builder.EntityRecognizer.findEntity(
      this.args.entities,
      'Color:Hex'
    );

    let options = {};

    if (namedColor || hexColor) {
      if (namedColor) {
        options.color = namedColor.entity;
      }
      if (hexColor) {
        options.color = hexColor.entity;
      }

      lifx
        .setState(options)
        .then(() => {
          this.session.send(`OK. Lamp color is now ${options.color}.`);
        })
        .catch(err => {
          this.session.send(err.message);
        });
    } else {
      this.session.send(
        `I think you want to change the color of the lamp, but I couldn't figure out which color you want to change it to. Please try again?`
      );
    }
  }
}

module.exports = Color;

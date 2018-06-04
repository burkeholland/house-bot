const LIFX = require('lifx-http-api');

const client = new LIFX({
  bearerToken: process.env.LIFX_TOKEN
});

/* Color Change Function */
function setState(options) {
  return client.setState('all', options);
}

module.exports = { setState: setState };

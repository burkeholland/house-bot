const LIFX = require('lifx-http-api');

const client = new LIFX({
  bearerToken: process.env.LIFX_TOKEN
});

/* Color Change Function */
function setState(options) {
  return client.setState('all', options);
}

function listLights() {
  return client.listLights('all').then(result => result);
}

module.exports = { setState: setState, listLights: listLights };

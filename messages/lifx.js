const LIFX = require('lifx-http-api');

const client = new LIFX({
  bearerToken: process.env.LIFX_TOKEN
});

/* Color Change Function */
function setState(options) {
  return new Promise((resolve, reject) => {
    client.setState('all', options).then(results => {
      if (results.results[0].status === `offline`) {
        reject({ message: `Burke's lamp is currently offline` });
      } else resolve(results);
    });
  });
}

function listLights() {
  return client.listLights('all').then(result => result);
}

module.exports = { setState: setState, listLights: listLights };

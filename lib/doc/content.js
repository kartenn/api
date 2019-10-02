'use strict';

const client = require('https');

const getContent = (url) => {
  return new Promise((resolve, reject) => {
    client.get(url, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data);
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = { getContent };

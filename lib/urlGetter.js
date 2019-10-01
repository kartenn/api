'use strict';

var url = require('url');
const client = require('https');

const urlGetter = (project) => 'https://' + (project.name) + '.thefork.io/';


const getUrlDocumentation = (project) => urlGetter(project) + 'doc.json';

const getDocumentationByUrl = (url) => {
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

const getDocumentationByProject = async (project) => getDocumentationByUrl(getUrlDocumentation(project));

module.exports = getDocumentationByProject;

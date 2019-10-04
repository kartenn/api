'use strict';

const LAYER = require('../constants/layers');
const { getRepositoryLayer } = require('./../helpers/repository');
const { getContent } = require('../doc/content');
const { getURL } = require('../doc/url');
const docGateway = require('./gateway/doc');
const docService = require('./service/doc');
const docWorker = require('./worker/doc');
const docWebhook = require('./webhook/doc');
const docApi = require('./api/doc');
const docApiGraphql = require('./api/graphql');

const getPayload = async (name, path) => {
  try {
    const url = getURL(name);
    const content = await getContent(url + path);

    return JSON.parse(content);
  } catch (e) {
    console.error('Error JSON.parse with the project ' + name);
    throw e;
  }
};

const docAdapter = async (name) => {
  try {
    let payload;
    switch (getRepositoryLayer(name)) {
      case LAYER.SERVICE_LAYER:
        payload = await getPayload(name, 'doc.json');

        return docService.transform(payload);
      case LAYER.WORKER_LAYER:
        payload = await getPayload(name, 'doc.json');

        return docWorker.transform(payload);
      case LAYER.GATEWAY_LAYER:
        payload = await getPayload(name, 'swagger.json');

        return docGateway.transform(payload);
      case LAYER.WEBHOOK_LAYER:
        payload = await getPayload(name, 'swagger.json');

        return docWebhook.transform(payload);
      case LAYER.API_LAYER:
        if (name === 'thefork-api' || name === 'tfm-api') {
          return docApiGraphql.transform(name);
        } else {
          payload = await getPayload(name, 'swagger.json');

          return docApi.transform(payload);
        }
    }
  } catch (e) {
    return null;
  }
};

module.exports = docAdapter;

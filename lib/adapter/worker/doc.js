'use strict';

const { getMethodList } = require('./../service/method');

const transformProperties = (properties) => {
  if (!properties) {
    return [];
  }

  return Object.entries(properties).map(entry => {
    const [name, definition] = entry;
    return { name, type: definition.type, description: '', required: false };
  });
};

const transform = async (payload) => {
  const { jobs } = payload.pages[0].body;

  const events = jobs.map(job => ({
    name: job.name,
    parameters: transformProperties(job.payloadSchema.properties),
  }));

  return { methods: getMethodList(payload), events };
};

module.exports = { transform };

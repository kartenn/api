'use strict';

const payloadToProjectTransformer = require('../transformer/payload-to-project-transformer');
const docAdapter = require('./../adapter/doc-adapter');
const documentation = require('./../helpers/documentation');

module.exports = {
  get: (req) => {
    console.log("Hello world received a request.");

    const target = process.env.TARGET || "World";

    return `Hello ${target}!`;
    },
  post: async (req) => {
    const payload = JSON.parse(req.payload.payload);

    const project = payloadToProjectTransformer(payload);

    const { methods, events } = await docAdapter(name);
    await documentation.save(project, methods, events);

    return project;
  },
};

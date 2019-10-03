'use strict';

const payloadToProjectTransformer = require('../transformer/payload-to-project-transformer');
const docAdapter = require('./../adapter/doc-adapter');
const documentation = require('./../helpers/documentation');
const getDependencies = require('./../helpers/getDependencies');
const populateAll = require('./populate-all');

module.exports = {
  get: (req) => {
    console.log("Hello world received a request.");

    const target = process.env.TARGET || "World";

    return `Hello ${target}!`;
    },
  post: async (req) => {
    populateAll();

    return 'ok';
  },
};

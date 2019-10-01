'use strict';

const { camelCase, map, mapKeys } = require('lodash');

const Project = require('../../../lib/models/project');

module.exports = {
  Query: {
    helloWorld: async (root, {input}, {}) => {
      const target = process.env.TARGET || "World";
      console.log("Hello world received a request.");

      return `Hello ${target}!`;
    },
    listProjects: async (root, {input}, {}) => {
      const projects = await Project.findAll();
      return map(projects, object => mapKeys(object, (value, key) => camelCase(key)));
    },
  },
};

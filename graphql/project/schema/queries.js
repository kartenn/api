'use strict';

const { camelCase, map, mapKeys, snakeCase } = require('lodash');

const Project = require('../../../lib/models/project');

module.exports = {
  Query: {
    getProject: async (root, input, {}) => {
      const snakeCaseInput = mapKeys(input, (value, key) => snakeCase(key));

      return mapKeys(await Project.findOneWithMethodsAndEvents(snakeCaseInput), (value, key) => camelCase(key));
    },
    listProjects: async (root, input, {}) => {
      const projects = await Project.findAll();
      return map(projects, object => mapKeys(object, (value, key) => camelCase(key)));
    },
  },
};

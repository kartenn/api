'use strict';

const MethodModel = require('../models/method');
const ParamModel = require('../models/param');
const MethodParamModel = require('../models/method-param');
const ProjectModel = require('../models/project');
const map = require('lodash/map');

module.exports = {
  create: async (project, methods) => {
    await ProjectModel.create(project);

    map(methods, async method => {
      await MethodModel.create(method.method);
      map(method.parameters, async parameter => {
        await ParamModel.create(parameter.param);
        await MethodParamModel.create(parameter.method_param);
      });
    });
  }
};

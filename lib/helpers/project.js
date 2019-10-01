'use strict';

const uuidv4 = require('uuid/v4');

const MethodModel = require('../models/method');
const ParamModel = require('../models/param');
const MethodParamModel = require('../models/method-param');
const ProjectModel = require('../models/project');
const map = require('lodash/map');

module.exports = {
  create: async (projectToSave, methodsToSave) => {
    const project = await ProjectModel.findOne({ name: projectToSave.name});

    if (project) {
      await ProjectModel.update(project.project_uuid, projectToSave);
    } else {
      await ProjectModel.create(Object.assign(projectToSave, {project_uuid: uuidv4()}));
    }

    map(methodsToSave, async method => {
      await MethodModel.create(method.method);
      map(method.parameters, async parameter => {
        await ParamModel.create(parameter.param);
        await MethodParamModel.create(parameter.method_param);
      });
    });
  }
};

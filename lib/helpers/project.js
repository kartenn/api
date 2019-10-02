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
    let projectUuid;

    if (project) {
      projectUuid = project.project_uuid;
      await ProjectModel.update(projectUuid, projectToSave);
      await ParamModel.deleteAllByProject(projectUuid);
      await MethodParamModel.deleteAllByProject(projectUuid);
      await MethodModel.deleteAllByProject(projectUuid);
    } else {
      projectUuid = uuidv4();
      await ProjectModel.create(Object.assign(projectToSave, { project_uuid: projectUuid }));
    }


    map(methodsToSave, async (method) => {
      await MethodModel.create({...method.method, project_uuid: projectUuid });
      map(method.parameters, async parameter => {
        await ParamModel.create(parameter.param);
        await MethodParamModel.create(parameter.method_param);
      });
    });
  }
};

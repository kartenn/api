'use strict';

const uuidv4 = require('uuid/v4');

const EventModel = require('../models/event');
const EventParamModel = require('../models/event-param');
const MethodModel = require('../models/method');
const MethodParamModel = require('../models/method-param');
const ParamModel = require('../models/param');
const ProjectModel = require('../models/project');
const map = require('lodash/map');

module.exports = {
  save: async (projectToSave, methodsToSave, eventsToSave = null) => {
    const project = await ProjectModel.findOne({ name: projectToSave.name});
    let projectUuid;

    try {
      if (project) {
        projectUuid = project.project_uuid;
        await ProjectModel.update(projectUuid, projectToSave);
        await ParamModel.deleteAllByProject(projectUuid);
        await MethodParamModel.deleteAllByProject(projectUuid);
        await MethodModel.deleteAllByProject(projectUuid);
      } else {
        projectUuid = uuidv4();
        await ProjectModel.create(Object.assign(projectToSave, {project_uuid: projectUuid}));
      }
    } catch (e) {
      console.error(`Error while saving project ${project.name}`);
    }

    map(methodsToSave, async (methodToSave) => {
      let method;

      try {
        method = await MethodModel.create({...methodToSave.method, project_uuid: projectUuid });
      } catch(e) {
        console.error(`Error while saving method ${method.name} of project ${project.name}`);
      }

      map(methodToSave.parameters, async parameter => {
        const param = await ParamModel.create(parameter);
        await MethodParamModel.create({
          param_uuid: param.param_uuid,
          method_uuid: method.method_uuid
        });
      });
    });
  },

  saveAll: async (methods) => {
    await MethodParamModel.deleteAll();
    await ParamModel.deleteAll();
    await MethodModel.deleteAll();

    return Promise.all(methods.map(async m => {
      const methodPromise = MethodModel.create(m.method);

      if (m.parameters.length === 0) {
        return methodPromise;
      }

      const method = await methodPromise;

      return Promise.all(m.parameters.map(async p => {
        const param = await ParamModel.create(p);

        return MethodParamModel.create({
          param_uuid: param.param_uuid,
          method_uuid: method.method_uuid
        });
      }));
    }));
  }
};

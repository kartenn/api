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

    map(methodsToSave, async (methodToSave) => {
      const method = await MethodModel.create({...methodToSave.method, project_uuid: projectUuid });
      map(methodToSave.parameters, async parameter => {
        const param = await ParamModel.create(parameter);
        await MethodParamModel.create({
          param_uuid: param.param_uuid,
          method_uuid: method.method_uuid
        });
      });
    });
    /**
    map(eventsToSave, async (event) => {
      await EventModel.create({...event, project_uuid: projectUuid });
      map(event.parameters, async parameter => {
        await ParamModel.create(parameter.param);
        await EventParamModel.create(parameter.event_param);
      });
    });
     **/
  }
};

'use strict';

const uuidv4 = require('uuid/v4');

const EventModel = require('../models/event');
const EventParamModel = require('../models/event-param');
const MethodModel = require('../models/method');
const MethodParamModel = require('../models/method-param');
const ParamModel = require('../models/param');
const ProjectModel = require('../models/project');
const ProjectCallsModel = require('../models/project-calls-project');
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
        await EventParamModel.deleteAllByProject(projectUuid);
        await EventModel.deleteAllByProject(projectUuid);
      } else {
        projectUuid = uuidv4();
        await ProjectModel.create(Object.assign(projectToSave, {project_uuid: projectUuid}));
      }
    } catch (e) {
      console.error(`Error while saving project ${project.name}`);
    }

    await map(methodsToSave, async (methodToSave) => {
      let method;

      try {
        method = await MethodModel.create({...methodToSave.method, project_uuid: projectUuid });
      } catch(e) {
        console.error(`Error while saving method ${method.name} of project ${project.name}`);
      }

      await map(methodToSave.parameters, async parameter => {
        const param = await ParamModel.create(parameter);
        await MethodParamModel.create({
          param_uuid: param.param_uuid,
          method_uuid: method.method_uuid
        });
      });
    });

    await map(eventsToSave, async (eventToSave) => {
      let event;
      try {
        event = await EventModel.create({...{ name: eventToSave.name }, project_uuid: projectUuid });
      } catch(e) {
        console.error(`Error while saving method ${eventToSave.name} of project ${project.name}`);
      }

      await map(eventToSave.parameters, async parameter => {
        const param = await ParamModel.create(parameter);
        await EventParamModel.create({
          param_uuid: param.param_uuid,
          event_uuid: event.event_uuid
        });
      });
    });
  },

  saveAll: async (methods) => {
    await MethodParamModel.deleteAll();
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
  },

  saveAllEvent: async (events) => {
    await EventParamModel.deleteAll();
    await EventModel.deleteAll();

    return Promise.all(events.map(async e => {
      const eventPromise = EventModel.create(e.event);

      if (e.parameters.length === 0) {
        return eventPromise;
      }

      const event = await eventPromise;

      return Promise.all(e.parameters.map(async p => {
        const param = await ParamModel.create(p);

        return EventParamModel.create({
          param_uuid: param.param_uuid,
          event_uuid: event.event_uuid
        });
      }));
    }));
  },

  saveAllProjectCalls: async (projectsCalls, nameUuidMap) => {
    await ProjectCallsModel.deleteAll();

    return Promise.all(projectsCalls.map(async projectCalls => {
      return Promise.all(projectCalls.dependencies.map(async dependencyName => {
        if (!nameUuidMap[dependencyName]) {
          console.warn(`Unable to get project_uuid of dependency ${dependencyName} called by ${projectCalls.name}`);
          return;
        }

        return ProjectCallsModel.create({
          caller_project_uuid: nameUuidMap[projectCalls.name],
          called_project_uuid: nameUuidMap[dependencyName],
        }).catch(e => {
          if (e.code === '23505') {
            console.warn('Project call already exists, ignoring');
            return;
          }
          throw e;
        });
      }));
    }));
  }
};

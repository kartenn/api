'use strict';

const head = require('lodash/head');
const pg = require('../../knex');

const tablePropertyList = [
  'project_uuid',
  'name',
  'url_repository',
  'id_repository',
  'code_owners',
  'languages',
  'slack_room',
  'dev_alias',
  'has_read_me',
  'type',
  'disk_usage'
];

const findAll = () => pg('project');

const findOne = whereClause => {
  return pg('project')
    .where(whereClause)
    .first();
};

const findManyByName = names => {
    return pg('project').whereIn('name', names);
};

const findOneWithMethodsAndEvents = whereClause => {
  const projectUuidColumnIdentifier = pg.ref('project.project_uuid');
  const subMethods = pg('method')
     .select(pg.raw('json_agg(json_build_object(\'name\', name, \'response\', response, \'params\', (select json_agg(json_build_object(\'name\', name, \'description\', description, \'required\', required, \'type\', type)) from "param" inner join "method_param" on "method_param"."param_uuid" = "param"."param_uuid" where "method_uuid" = "method"."method_uuid")))'))
     .where('project_uuid',  projectUuidColumnIdentifier)
     .as('methods');

    const subEvents = pg('event')
       .select(pg.raw('json_agg(json_build_object(\'name\', name, \'params\', (select json_agg(json_build_object(\'name\', name, \'description\', description, \'required\', required, \'type\', type)) from "param" inner join "event_param" on "event_param"."param_uuid" = "param"."param_uuid" where "event_uuid" = "event"."event_uuid")))'))
       .where('project_uuid',  projectUuidColumnIdentifier)
       .as('events');

    const subCalls = pg('project_calls_project')
       .select(pg.raw('array_agg(name)'))
       .innerJoin('project as p2', 'p2.project_uuid', 'project_calls_project.called_project_uuid')
       .where('caller_project_uuid', projectUuidColumnIdentifier)
       .as('calls');

    const subCalled = pg('project_calls_project')
       .select(pg.raw('array_agg(name)'))
       .innerJoin('project as p2', 'p2.project_uuid', 'project_calls_project.caller_project_uuid')
       .where('called_project_uuid', projectUuidColumnIdentifier)
       .as('called');


  return pg('project')
     .select('project.*', subMethods, subEvents, subCalls, subCalled)
     .where(whereClause)
     .first();
};

const create = project => pg('project')
    .returning(tablePropertyList)
    .insert(project)
    .then(head);

const update = (project_uuid, project) => pg('project')
    .where({ project_uuid })
    .update(project)
    .returning(tablePropertyList)
    .then(head);

module.exports = { findAll, findOne, findManyByName, findOneWithMethodsAndEvents, create, update };

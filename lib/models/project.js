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

const findOneWithMethodsAndEvents = whereClause => {
  const projectUuidColumnIdentifier = pg.ref('project.project_uuid');
  const methodUuidColumnIdentifier = pg.ref('method.method_uuid');
  const subParams = pg('param')
     .select(pg.raw('json_agg(json_build_object(\'name\', name, \'description\', description, \'required\', required, \'type\', type))'))
     .join('method_param', 'method_param.param_uuid', 'param.param_uuid')
     .where('method_param.method_uuid', methodUuidColumnIdentifier)
     .as('params');




  const subMethods = pg('method')
     .select(pg.raw('json_agg(json_build_object(\'name\', name, \'response\', response, \'params\', (select json_agg(json_build_object(\'name\', name, \'description\', description, \'required\', required, \'type\', type)) from "param" inner join "method_param" on "method_param"."param_uuid" = "param"."param_uuid" where "method_uuid" = "method"."method_uuid")))'))
     .where('project_uuid',  projectUuidColumnIdentifier)
     .as('methods');

  return pg('project')
     .select('project.*', subMethods)
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

module.exports = { findAll, findOne, findOneWithMethodsAndEvents, create, update };

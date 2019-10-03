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
  const subMethods = pg('method')
     .select(pg.raw('json_agg(json_build_object(\'name\', name, \'response\', response))'))
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

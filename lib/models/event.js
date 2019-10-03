'use strict';

const head = require('lodash/head');
const pg = require('../../knex');

const tablePropertyList = [
  'event_uuid',
  'project_uuid',
  'name',
  'exchange',
  'domain',
];

const create = method => pg('event')
  .returning(tablePropertyList)
  .insert(method)
  .then(head);

const deleteAll = () => pg('event').delete();

const deleteAllByProject = project_uuid => pg('event')
  .where({ project_uuid })
  .delete();

const findOne = whereClause => pg('event')
    .where(whereClause)
    .first();

const findAllByProject = (project_uuid) => pg('event')
  .where({ project_uuid });

module.exports = { create, deleteAll, deleteAllByProject, findAllByProject };


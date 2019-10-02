'use strict';

const head = require('lodash/head');
const pg = require('../../knex');

const tablePropertyList = [
  'method_uuid',
  'project_uuid',
  'name',
  'response',
];

const create = method => pg('method')
  .returning(tablePropertyList)
  .insert(method)
  .then(head);

const deleteAllByProject = project_uuid => pg('method')
  .where({ project_uuid })
  .delete();

const findOne = whereClause => {
  return pg('method')
    .where(whereClause)
    .first();
};

const findAllByProject = (project_uuid) => pg('method')
  .where({ project_uuid });

module.exports = { create, deleteAllByProject, findAllByProject, findOne };


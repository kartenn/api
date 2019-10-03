'use strict';

const head = require('lodash/head');
const pg = require('../../knex');

const tablePropertyList = [
  'caller_project_uuid',
  'called_project_uuid',
  'method_uuid',
];

const create = project_calls_project => pg('project_calls_project')
  .returning(tablePropertyList)
  .insert(project_calls_project)
  .then(head);

const deleteAll = () => pg('project_calls_project').delete();

const deleteAllByMethod = method_uuid => pg('project_calls_project')
  .where({ method_uuid })
  .delete();

module.exports = {
  create,
  deleteAll,
  deleteAllByMethod,
};

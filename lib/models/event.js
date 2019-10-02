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

const deleteAllByProject = project_uuid => pg('event')
  .where({ project_uuid })
  .delete();

module.exports = { create, deleteAllByProject };


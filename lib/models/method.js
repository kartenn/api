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

module.exports = { create };


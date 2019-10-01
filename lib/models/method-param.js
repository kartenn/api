'use strict';

const head = require('lodash/head');
const pg = require('../../knex');

const tablePropertyList = [
  'param_uuid',
  'method_uuid',
];

const create = methodParam => pg('method_param')
  .returning(tablePropertyList)
  .insert(methodParam)
  .then(head);

module.exports = { create };


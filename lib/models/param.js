'use strict';

const head = require('lodash/head');
const pg = require('../../knex');

const tablePropertyList = [
  'param_uuid',
  'name',
  'description',
  'required',
  'type',
];

const create = param => pg('param')
  .returning(tablePropertyList)
  .insert(param)
  .then(head);

module.exports = { create };

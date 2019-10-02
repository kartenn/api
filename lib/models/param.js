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

const deleteAllByProject = project_uuid => pg('param')
  .whereIn('param_uuid', function() {
    this.select('param_uuid')
      .from('method_param')
      .whereIn('method_uuid', function() {
        this.select('method_uuid')
          .from('method')
          .where('project_uuid', project_uuid);
      });
  })
  .delete();

module.exports = { create, deleteAllByProject };

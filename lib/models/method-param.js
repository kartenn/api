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

const deleteAllByMethod = method_uuid => pg('method_param')
  .where({ method_uuid })
  .delete();

const deleteAllByProject = project_uuid => pg('method_param')
  .whereIn('method_uuid', function() {
    this.select('method_uuid')
      .from('method')
      .where('project_uuid', project_uuid);
  })
  .delete();

module.exports = { create, deleteAllByMethod, deleteAllByProject };


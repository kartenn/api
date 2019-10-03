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

const deleteAll = () => pg('param').delete();

const deleteAllByEvent = event_uuid => pg('param')
  .whereIn('param_uuid', function() {
    this.select('param_uuid')
      .from('event_param')
      .where({ event_uuid })
  })
  .delete();

const deleteAllByMethod = method_uuid => pg('param')
  .whereIn('param_uuid', function() {
    this.select('param_uuid')
      .from('method_param')
      .where({ method_uuid })
  })
  .delete();

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

const findAllByEvent = event_uuid => pg('param')
  .whereIn('param_uuid', function() {
    this.select('param_uuid')
      .from('event_param')
      .where({ event_uuid });
  });

const findAllByMethod = method_uuid => pg('param')
  .whereIn('param_uuid', function() {
    this.select('param_uuid')
      .from('method_param')
      .where({ method_uuid });
  });

const findAllByProject = project_uuid => pg('param')
  .whereIn('param_uuid', function() {
    this.select('param_uuid')
      .from('method_param')
      .whereIn('method_uuid', function() {
        this.select('method_uuid')
          .from('method')
          .where('project_uuid', project_uuid);
      });
  });

module.exports = {
  create,
  deleteAll,
  deleteAllByEvent,
  deleteAllByMethod,
  deleteAllByProject,
  findAllByEvent,
  findAllByMethod,
  findAllByProject
};

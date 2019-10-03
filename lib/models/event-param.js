'use strict';

const head = require('lodash/head');
const pg = require('../../knex');

const tablePropertyList = [
  'param_uuid',
  'event_uuid',
];

const create = eventParam => pg('event_param')
  .returning(tablePropertyList)
  .insert(eventParam)
  .then(head);

const deleteAll = () => pg('event_param').delete();

const deleteAllByEvent = event_uuid => pg('event_param')
  .where({ event_uuid })
  .delete();

const deleteAllByProject = project_uuid => pg('event_param')
  .whereIn('event_uuid', function() {
    this.select('event_uuid')
      .from('event')
      .where('project_uuid', project_uuid);
  })
  .delete();

module.exports = { create, deleteAll, deleteAllByEvent, deleteAllByProject };


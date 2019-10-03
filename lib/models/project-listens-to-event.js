'use strict';

const head = require('lodash/head');
const pg = require('../../knex');

const tablePropertyList = [
  'listening_project_uuid',
  'listened_event_uuid',
];

const create = project_listens_to_event => pg('project_listens_to_event')
  .returning(tablePropertyList)
  .insert(project_listens_to_event)
  .then(head);

const deleteAll = () => pg('project_listens_to_event').delete();

const deleteAllByProject = project_uuid => pg('project_listens_to_event')
  .where({ listening_project_uuid: project_uuid })
  .delete();

module.exports = {
  create,
  deleteAll,
  deleteAllByProject,
};

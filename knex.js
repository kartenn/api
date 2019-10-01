'use strict';

const config = require('config');

const db = config.get('db.master');

const pg = require('knex')({
  client: db.client,
  connection: db.connection,
  debug: false,
});

module.exports = pg;

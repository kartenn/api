'use strict';

const knex = require('knex');
const config = require('config');
const _ = require('lodash');

const configWithoutDB = {
  client: config.get('db.master.client'),
  connection: {
    ..._.pick(config.get('db.master.connection'), ['host', 'user', 'password', 'port']),
    database: 'postgres'
  }
};

const createDBIfNotExist = async () => {
  const knexClient = knex(configWithoutDB);
  const dbName = config.get('db.master.connection.database');

  try {
    const { rows } = await knexClient.raw(`select * from pg_database where datname='${dbName}';`);
    if (_.size(rows) === 0) {
      await knexClient.raw(`CREATE DATABASE ${dbName}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  }
};

createDBIfNotExist();

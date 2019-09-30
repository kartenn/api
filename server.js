'use strict';

const path = require('path');
const { createApiGateway } = require('@thefork/node-platform');
const config = require('config');

const graphqlSchema = require('./graphql/schema');

var knex = require('knex')({
  client: 'pg',
  connection: config.get('db.master')
});
const serverConfig = config.get('server');

const api = createApiGateway({
  port: process.env.NODE_PORT || serverConfig.get('port'),
  host: serverConfig.get('host'),
  auth: false,
  graphql: {
    graphqlSchema,
    graphqlEnabled: true,
  }
});

// register routes
api.loadAPIRoutes(path.join(__dirname, './lib/routes/**/*.js'));

module.exports = { api };

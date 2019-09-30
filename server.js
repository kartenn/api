'use strict';

const path = require('path');
const { createApiGateway } = require('@thefork/node-platform');
const config = require('config');

const graphqlSchema = require('./graphql/schema');

var knex = require('knex')({
  client: 'pg',
  connection: config.get('db.master')
});

const api = createApiGateway({
  auth: false,
  graphql: {
    graphqlSchema,
    graphqlEnabled: true,
  }
});

// register routes
api.loadAPIRoutes(path.join(__dirname, './lib/routes/**/*.js'));

module.exports = { api };

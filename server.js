'use strict';

const path = require('path');
const NoIntrospection = require('graphql-disable-introspection');
const { createApiGateway } = require('@thefork/node-platform');
const config = require('config');

const {
  createLogger,
  APPLICATION_TYPES,
  resolveLevel,
  STREAM_NAMES,
} = require("@thefork/node-logger");

const graphqConfig = config.get('graphql');

// create a logger
const logger = createLogger({
  applicationName: 'kartenn-api',
  applicationType: APPLICATION_TYPES.API,
  level: resolveLevel("info"),
  streamsOptions: [STREAM_NAMES.LOGSTASH_FILE, STREAM_NAMES.LOGSTASH_STDOUT],
});

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
  logger,
  graphql: {
    graphqlSchema,
    graphqlEnabled: true,
    playgroundEnabled: true,
    graphqlOptions: {
      ...graphqConfig,
      validationRules: graphqConfig.introspection ? undefined : [NoIntrospection],
    },
  },
  deobfuscateRequestError: true,
});

// register routes
api.loadAPIRoutes(path.join(__dirname, './lib/routes/**/*.js'));

module.exports = { api };

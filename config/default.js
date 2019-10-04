'use strict';

const TheforkLogger = require('@thefork/node-logger');

module.exports = {
  server: {
    host: '0.0.0.0',
    port: 9990
  },
  logger: {
    logsDir: 'logs',
    level: 'info',
    streams: [TheforkLogger.STREAM_NAMES.LOGSTASH_FILE],
  },
  db: {
    master: {
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        user: 'lafourchette',
        password: 'lafourchette',
        database: 'kartenn'
      }
    },
    slave: {
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        user: 'lafourchette',
        password: 'lafourchette',
        database: 'kartenn'
      }
    }
  },
  graphql: {
    introspection: true,
  },
  github: {
    api: {
      accessToken: '3fd7ec3e9eb9f4a5936b3282a16714864a90e817',
      baseUri: 'https://api.github.com/graphql',
    },
  },
};

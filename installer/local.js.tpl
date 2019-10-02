'use strict';

const { STREAM_NAMES } = require('@thefork/node-logger');

module.exports = {
  logger: {
    level: 'debug',
    streams: [STREAM_NAMES.LOGSTASH_FILE, STREAM_NAMES.CONSOLE],
  },
  github: {
    api: {
      accessToken: (() => { throw 'You need to create and use a GitHub API access token' })(),
      baseUri: 'https://api.github.com/graphql',
    },
  },
};

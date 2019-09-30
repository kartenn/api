'use strict';

const { STREAM_NAMES } = require('@thefork/node-logger');

module.exports = {
  logger: {
    level: 'debug',
    streams: [STREAM_NAMES.LOGSTASH_FILE, STREAM_NAMES.CONSOLE]
  }
};

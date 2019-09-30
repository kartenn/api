'use strict';

const Joi = require('joi');
const handlers = require('../handlers/index.js');


module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      description: 'homepage',
      tags: ['api'],
      handler: handlers.get,
    },
  },

  {
    method: 'POST',
    path: '/payload',
    config: {
      description: 'Callback github',
      tags: ['api'],
      handler: handlers.post,
    },
  }
];

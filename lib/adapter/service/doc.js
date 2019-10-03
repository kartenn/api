'use strict';

const { getMethodList } = require('./method');
const { getEventList } = require('./event');

const transform = async (payload) => {
  return { methods: getMethodList(payload), events: getEventList(payload) };
};

module.exports = { transform };

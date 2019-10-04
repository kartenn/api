'use strict';

const { getMethodList } = require('../webhook/method');

const transform = async (payload) => {
  return { methods: getMethodList(payload), events: [] };
};

module.exports = { transform };

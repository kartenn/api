'use strict';

const { getMethodList } = require('./method');

const transform = async (payload) => {
  return { methods: getMethodList(payload) };
};

module.exports = { transform };

'use strict';

const {SERVICE_LAYER, WORKER_LAYER, API_LAYER, GATEWAY_LAYER} =require('./../constants/layers');

const getRepositoryLayer = (name) => {
  if (RegExp("-api$").test(name)) return API_LAYER;
  if (RegExp("-gateway$").test(name)) return GATEWAY_LAYER;
  if (RegExp("-service$").test(name)) return SERVICE_LAYER;
  if (RegExp("-worker$").test(name)) return WORKER_LAYER;
};

module.exports = {
  getRepositoryLayer
};

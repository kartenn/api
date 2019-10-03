'use strict';

var jp = require('jsonpath');
const flatten = require('lodash/flatten');
const map = require('lodash/map');

const getMethodParameters = (methodDocumentation) => {
  const parameterList = [];

  // define the parameters model
  const params = methodDocumentation.parameters;

  map(params, property => {
    const parameter = {
      name: property.name,
      required: !!property.required || false,
      type: property.type
    };
    parameterList.push(parameter);
  });

  return parameterList;
};
const getMethodList = (payload) => {
  const methodList = [];

  // gateway, for example, customer-gateway
  const methodsDocumentation = jp.query(payload, '$.paths');
  if (methodsDocumentation.length > 0) {

    const methodsWithPath = Object
      .keys(methodsDocumentation[0])
      .map(key  => Object.keys(methodsDocumentation[0][key])
        .map(k => Object.assign(methodsDocumentation[0][key][k], { restMethod: k, routePath: key })))
    ;
    const methodsWithPathFlatten = flatten(methodsWithPath);

    methodsWithPathFlatten.forEach(methodWithPath => {
      // define a method model
      const methodToSave = {
        name: (methodWithPath.restMethod).toUpperCase() + ' ' + methodWithPath.routePath,
        response: methodWithPath
      };
      const parameters = getMethodParameters(methodWithPath);
      methodList.push({ method: methodToSave, parameters});
    });
  }

  return methodList;
};

const transform = async (payload) => {
  return { methods: getMethodList(payload), events: [] };
};

module.exports = { transform };

'use strict';

var jp = require('jsonpath');
const flatten = require('lodash/flatten');
const map = require('lodash/map');

const getMethodParameters = (methodDocumentation, payload) => {
  const parameterList = [];

  // define the parameters model
  const params = methodDocumentation.parameters;

  map(params, property => {
    if (property.name && property.name !== 'body') {
      const parameter = {
        name: property.name,
        required: !!property.required || false,
        type: property.type
      };
      parameterList.push(parameter);
    } else if (property.schema) {
      const path = (property.schema['$ref'])
        .replace('#', '$')
        .split('/');

      const m = jp.query(
        payload,
        jp.stringify(path)
      );
      if (m.length > 0) {
        const properties = m[0].properties;
        if (properties) {
          const propertiesWithName = Object.keys(properties).map(key => Object.assign(properties[key], {name: key}));

          map(propertiesWithName, p => {
            if (p.name) {
              const parameter = {
                name: p.name,
                required: !!p.required || false,
                type: p.type
              };
              parameterList.push(parameter);
            }
          });
        }
      }
    }
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
        name: methodWithPath.routePath,
        response: methodWithPath,
        type: methodWithPath.restMethod.toUpperCase()
      };
      const parameters = getMethodParameters(methodWithPath, payload);
      methodList.push({ method: methodToSave, parameters});
    });
  }

  return methodList;
};

module.exports = { getMethodList };

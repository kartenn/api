'use strict';

var jp = require('jsonpath');
const map = require('lodash/map');

const getMethodParameters = (methodDocumentation) => {
  const parameterList = [];

  // define the parameters model
  const params = methodDocumentation.params;
  if (params.type === 'object') {
    const properties = params.properties;
    const propertiesWithName = Object.keys(properties).map(key  => Object.assign(properties[key], { name: key }));

    map(propertiesWithName, property => {
      const parameter = {
        name: property.name,
        description: property.description,
        required: !!property.required || false,
        type: property.type
      };
      parameterList.push(parameter);
    });
  }

  return parameterList;
};
const getMethodList = (doc) => {
  const methodList = [];

  // service JSON-RPC PHP, for example, customer-service
  const methodsDocumentation = jp.query(doc, '$.pages[?(@.type=="json-rpc")].body.methods');
  if (methodsDocumentation.length > 0) {
    methodsDocumentation[0].forEach(methodDocumentation => {

      // define a method model
      const methodToSave = {
        name: methodDocumentation.name,
        response: methodDocumentation,
        type: 'JSON-RPC'
      };
      const parameters = getMethodParameters(methodDocumentation);
      methodList.push({ method: methodToSave, parameters});
    });
  }

  return methodList;
};

module.exports = {
  getMethodList
};

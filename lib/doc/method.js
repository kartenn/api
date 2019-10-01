'use strict';

const uuidv4 = require('uuid/v4');
var jp = require('jsonpath');
const map = require('lodash/map');

const getMethodParameters = (methodDocumentation, methodUuid) => {
  const parameterList = [];

  // define the parameters model
  const params = methodDocumentation.params;
  if (params.type === 'object') {
    const properties = params.properties;
    const propertiesWithName = Object.keys(properties).map(key  => Object.assign(properties[key], { name: key }));

    map(propertiesWithName, property => {
      // define a parameter model
      const param_uuid = uuidv4();
      const method_param = {
        param_uuid,
        method_uuid: methodUuid
      };
      const param = {
        param_uuid,
        name: property.name,
        description: property.description,
        required: !!property.required || false,
        type: property.type
      };
      const parameter = { method_param, param };
      parameterList.push(parameter);
    });
  }

  return parameterList;
};
const getMethodList = (project, doc) => {
  const methodList = [];

  // service JSON-RPC PHP, for example, customer-service
  const methodsDocumentation = jp.query(doc, '$.pages[?(@.type=="json-rpc")].body.methods');
  if (methodsDocumentation.length > 0) {
    methodsDocumentation[0].forEach(methodDocumentation => {

      // define a method model
      const methodUuid = uuidv4();
      const methodToSave = {
        method_uuid: methodUuid,
        project_uuid: project.project_uuid,
        name: methodDocumentation.name,
        response: methodDocumentation
      };
      const parameters = getMethodParameters(methodDocumentation, methodUuid);
      methodList.push({ method: methodToSave, parameters});
    });
  }

  return methodList;
};

module.exports = {
  getMethodList
};

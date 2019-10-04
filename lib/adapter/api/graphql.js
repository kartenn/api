'use strict';

var jp = require('jsonpath');
var request = require('request');
var introspectionQuery_1 = require("graphql/utilities/introspectionQuery");
const map = require('lodash/map');

const getContent = (url) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: url,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      json: true,
      body: { query: introspectionQuery_1.introspectionQuery }
    }, (response, error, body) => resolve(body))
      .on("error", err => reject(err));

  });
};

const getMethodParameters = (method) => {
  const parameterList = [];
  map(method.args, p => {
    if (p.name) {
      const parameter = {
        name: p.name,
        required: false,
        type: p.type.offtype ? p.type.offtype.name : p.type.name
      };
      parameterList.push(parameter);
    }
  });

  return parameterList;
};
const getMethodList = (doc) => {
  const methodList = [];
  const queryType = doc.__schema.queryType.name;
  const mutationType = doc.__schema.mutationType.name;

  // service JSON-RPC PHP, for example, customer-service
  const queries = jp.query(doc, '$.__schema.types[?(@.name=="' + queryType + '")].fields');
  if (queries.length > 0) {
    queries[0].forEach(query => {

      // define a method model
      const methodToSave = {
        name: query.name,
        response: query,
        type: 'GRAPHQL'
      };
      const parameters = getMethodParameters(query);
      methodList.push({ method: methodToSave, parameters});
    });
  }
  const mutations = jp.query(doc, '$.__schema.types[?(@.name=="' + mutationType + '")].fields');
  if (mutations.length > 0) {
    mutations[0].forEach(mutation => {

      // define a method model
      const methodToSave = {
        name: mutation.name,
        response: mutation,
        type: 'GRAPHQL'
      };
      const parameters = getMethodParameters(mutation);
      methodList.push({ method: methodToSave, parameters});
    });
  }

  return methodList;
};

const transform = async (name) => {
  if (name === 'thefork-api') {
    const { data } = await getContent('https://m.preprod.lafourchette.com/api/graphql');
    return { methods: data ? getMethodList(data) : [], events: [] };
  }

  if (name === 'tfm-api') {
    const { data } = await getContent('https://manager.preprod.lafourchette.com/api/graphql');
    return { methods: data ? getMethodList(data) : [], events: [] };
  }

  return { methods: [], events: [] };
};

module.exports = { transform };

'use strict';

var jp = require('jsonpath');
const map = require('lodash/map');

const getEventParameters = (event) => {
  const parameterList = [];

  // define the parameters model
  if (event.payload) {
    const properties = event.payload.properties;
    const propertiesWithName = Object.keys(properties).map(key  => Object.assign(properties[key], { name: key }));

    const propertiesRequired = event.payload.required;
    map(propertiesWithName, property => {
      const parameter = {
        name: property.name,
        description: property.description,
        required: !!property.required || propertiesRequired.includes(property.name) || false,
        type: property.type
      };
      parameterList.push(parameter);
    });
  }

  console.log(parameterList);
  return parameterList;
};

const getEventList = (doc) => {
  const eventList = [];
  const events = jp.query(doc, '$.pages[?(@.type=="events")].body.events');
  if (events.length > 0) {
    events[0].forEach(event => {
      eventList.push({...{name: event.name}, parameters: getEventParameters(event)});
    });
  }

  return eventList;
};

module.exports = {
  getEventList
};

const _ = require('lodash');

const domainsRegExp = RegExp("(?:domains.)(.+-(?:service|gateway|worker|api))", "g")

function parseDependenciesFromConfigFile(text) {
  let dependecies = [],
    match = null

  while ((match = domainsRegExp.exec(text))) {
    dependecies.push(match[1])
  }

  return dependecies
}

function getDependencies(files) {
  const dependenciesFromConfigFiles = _.flatten(
    _.map(
      _.compact(_.filter(files)),
      'text'
    ).map(parseDependenciesFromConfigFile)
  );
  return dependenciesFromConfigFiles;
}

module.exports = getDependencies;

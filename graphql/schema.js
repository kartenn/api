'use strict';

const path = require('path');
const glob = require('glob');

const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');


const queriesPath = path.join(__dirname, './**/queries.js');
const mutationsPath = path.join(__dirname, './**/mutations.js');
const typeDefsPath = path.join(__dirname, './**/types.js');

const RootQuery = `
  type Query
  type Mutation
`;

const getTypeDefs = (globPath) => {
  const files = glob.sync(globPath);
  return files.reduce((acc, file) => [...acc, ...require(file)], [RootQuery]); // eslint-disable-line global-require, import/no-dynamic-require
};

const getResolvers = (globPath) => {
  const files = glob.sync(globPath);
  return files.reduce((acc, file) => [...acc, require(file)], []); // eslint-disable-line global-require, import/no-dynamic-require
};

const typeDefs = getTypeDefs(typeDefsPath);

const resolvers = [
  ...getResolvers(mutationsPath),
  ...getResolvers(queriesPath),
];

const makeSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const { schema } = applyMiddleware(makeSchema);

module.exports = schema;

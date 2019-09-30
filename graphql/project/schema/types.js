'use strict';

module.exports = [`
    type Project {
        id: ID
    }
    extend type Query {
      helloWord: String
    }
    extend type Mutation {
      test: String
    }
`];

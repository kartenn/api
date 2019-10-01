'use strict';

module.exports = [`
    type Project {
        id: ID
    }
    extend type Query {
      helloWorld: String
    }
    extend type Mutation {
      test: String
    }
`];

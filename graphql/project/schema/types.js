'use strict';

module.exports = [`
  type Project {
    projectUuid: ID
    name: String
    urlRepository: String
    idRepository: Int
    codeOwners: [String]
    languages: [String]
    slackRoom: String
    devAlias: String
    hasReadMe: Boolean
    type: String
    createdTs: String
    updatedTs: String
  }
  extend type Query {
    helloWorld: String
    getProject(idRepository: ID): Project
    listProjects: [Project]
  }
  extend type Mutation {
    test: String
  }
`];

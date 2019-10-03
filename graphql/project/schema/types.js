'use strict';

module.exports = [`
  scalar JSON
  scalar JSONObject

  type Method {
    name: String
    response: JSONObject
  }
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
    diskUsage: Int
    methods: [Method]
  }
  extend type Query {
    getProject(projectUuid: ID): Project
    listProjects: [Project]
  }
  extend type Mutation {
    test: String
  }
`];

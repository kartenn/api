'use strict';

module.exports = [`
  scalar JSON
  scalar JSONObject

  type Param {
    name: String
    description: String
    required: Boolean
    type: String
  }
  type Method {
    name: String
    response: JSONObject
    params: [Param]
  }
  type Event {
    name: String
    params: [Param]
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
    events: [Event]
    calls: [String]
    called: [String]
  }
  extend type Query {
    getProject(projectUuid: ID): Project
    listProjects: [Project]
  }
  extend type Mutation {
    test: String
  }
`];

'use strict';

const payloadToProjectTransformer = require('../transformer/payload-to-project-transformer');
const getDocumentationByProject = require('../urlGetter');
const { getMethodList } = require('../doc/method');
const projectHelper = require('../helpers/project');

module.exports = {
  get: (req) => {
    console.log("Hello world received a request.");
    console.dir(req);

    const target = process.env.TARGET || "World";

    return `Hello ${target}!`;
    },
  post: async (req) => {
    const payload = JSON.parse(req.payload.payload);

    const project = payloadToProjectTransformer(payload);

    const doc = await getDocumentationByProject(project);
    const docParsed = JSON.parse(doc);
    const methods = getMethodList(project, docParsed);

    projectHelper.create(project, methods);

    const target = process.env.TARGET || "World";

    return `Hello ${target}!`;
  },
};

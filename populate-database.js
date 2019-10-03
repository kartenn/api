'use strict';

const _ = require('lodash');
const config = require('config');
const fetch = require('node-fetch');
const gql = require('graphql-tag');
const knex = require('knex');
const uuidv4 = require('uuid/v4');
const { ApolloClient } = require('apollo-client');
const { HttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');

const Project = require('./lib/models/project');
const docAdapter = require('./lib/adapter/doc-adapter');
const documentation = require('./lib/helpers/documentation');
const getDependencies = require('./lib/helpers/getDependencies');

const githubClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: config.get('github.api.baseUri'),
    headers: {
      authorization: `Bearer ${config.get('github.api.accessToken')}`,
    },
    fetch: fetch,
  }),
});

const configWithoutDB = {
  client: config.get('db.master.client'),
  connection: {
    ..._.pick(config.get('db.master.connection'), ['host', 'user', 'password', 'port']),
    database: 'postgres'
  }
};

const populateDB = async () => {
  const knexClient = knex(configWithoutDB);
  const dbName = config.get('db.master.connection.database');

  try {
    const query = gql`
      query($first: Int = 100, $after: String = "") {
        organization(login: "lafourchette") {
          repositories(
            first: $first
            after: $after
            isFork: false
            orderBy: { field: NAME, direction: ASC }
          ) {
            pageInfo {
              endCursor
              hasNextPage
            }

            edges {
              node {
                name
                url
                createdAt
                updatedAt
                diskUsage

                codeOwners: object(expression: "master:.github/CODEOWNERS") {
                  ... on Blob {
                    text
                  }
                }

                repositoryTopics(first: 100) {
                  edges {
                    node {
                      topic {
                        name
                      }
                    }
                  }
                }

                markdownReadme: object(expression: "master:README.md") {
                  ... on Blob {
                    text
                  }
                }

                textReadme: object(expression: "master:README.txt") {
                  ... on Blob {
                    text
                  }
                }
                
                configDefault: object(expression: "master:config/default.js") {
                  ... on Blob {
                    text
                  }
                }
    
                installerLocal: object(
                  expression: "master:installer/local.js.tpl"
                ) {
                  ... on Blob {
                    text
                  }
                }
    
                installerDefault: object(
                  expression: "master:installer/default.json.tpl"
                ) {
                  ... on Blob {
                    text
                  }
                }
              }
            }
          }
        }
      }
    `;

    let hasNextPage;
    let after = null;
    let repos = [];
    do {
      const data = (await githubClient.query({ query, variables: { first: 100, after } })).data;

      hasNextPage = data.organization.repositories.pageInfo.hasNextPage;
      after = data.organization.repositories.pageInfo.endCursor;

      repos = repos.concat(data.organization.repositories.edges);
    } while (hasNextPage === true);

    const nodes = repos.map(r => r.node);

    let methodsToInsert = [];

    await Promise.all(nodes.map(async (node) => {
      let type = node['name'].substring(node['name'].lastIndexOf('-') + 1);

      if (['service', 'gateway', 'api', 'worker', 'webhook'].indexOf(type) === -1) {
        type = null;
      }

      if (type !== null) {
        try {
          const res = await Project.findOne({ name: node['name'] });
          let project;
          if (res) {
            project = await Project.update(res.project_uuid, {
              name: node['name'],
              url_repository: node['url'],
              code_owners: node['codeOwners'] ? node['codeOwners'].text.split('\n').filter(c => c !== '') : [],
              type,
              created_ts: node['createdAt'],
              updated_ts: node['updatedAt'],
              disk_usage: node['diskUsage']
            });
          } else {
            project = await Project.create({
              project_uuid: uuidv4(),
              name: node['name'],
              url_repository: node['url'],
              code_owners: node['codeOwners'] ? node['codeOwners'].text.split('\n').filter(c => c !== '') : [],
              type,
              created_ts: node['createdAt'],
              updated_ts: node['updatedAt'],
              disk_usage: node['diskUsage']
            });
          }
          const doc = await docAdapter(node['name']);
          const dependencies = getDependencies([node['installerLocal'], node['installerDefault']]);
          if (doc) {
            methodsToInsert = methodsToInsert.concat(doc
               .methods
               .map(m => ({
                 method: {...m.method, project_uuid: project.project_uuid},
                 parameters: m.parameters
               }))
            );
          } else {
            console.log(`No doc found for project ${node.name}`);
          }
        } catch (e) {
          console.log('Error:', e)
        }
      }
    }));

    await documentation.saveAll(methodsToInsert);

    process.exit(0);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  }
};

populateDB();

'use strict';

const _ = require('lodash');
const config = require('config');
const fetch = require('node-fetch');
const gql = require('graphql-tag');
const jsonpath = require('jsonpath');
const knex = require('knex');
const uuidv4 = require('uuid/v4');
const { ApolloClient } = require('apollo-client');
const { HttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');

const Project = require('./lib/models/project');

const githubClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: config.get('github.api.baseUri'),
    headers: {
      authorization: `Bearer ${config.get('github.api.accessToken')}`,
    },
    fetch: fetch,
  }),
})

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
              }
            }
          }
        }
      }
    `

    const result = await githubClient.query({ query, variables: { first: 50, after: null, } });
    const nodes = jsonpath.query(result, '$.data.organization.repositories.edges[*].node');


    await Promise.all(_.map(nodes, async (node) => {
      let type = node['name'].substring(node['name'].lastIndexOf('-') + 1);

      if (['service', 'gateway', 'api', 'worker'].indexOf(type) === -1) {
        type = null;
      }

      if (type !== null) {
        try {
          const res = await Project.findOne({ name: node['name'] });
          if (res) {
            const upd = await Project.update(res.project_uuid, {
              name: node['name'],
              url_repository: node['url'],
            });
          } else {
            const ins = await Project.create({
              project_uuid: uuidv4(),
              name: node['name'],
              url_repository: node['url'],
              code_owners: node['codeOwners'] ? node['codeOwners'].text.split('\n').filter(c => c !== '') : [],
              type
            });
          }
        } catch (e) {
          console.log('Error:', e)
        }
      }
    }));

    process.exit(0);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  }
};

populateDB();

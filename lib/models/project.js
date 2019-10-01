const pg = require('../../knex');

const findAll = () => pg('project');

const findOne = whereClause => {
  return pg('project')
    .where(whereClause)
    .first();
};

module.exports = { findAll, findOne };

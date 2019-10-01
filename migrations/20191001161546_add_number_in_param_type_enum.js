
exports.up = function(knex) {
  const query = `
  ALTER TABLE param ALTER COLUMN type TYPE VARCHAR;
  DROP TYPE param_type;
  
  CREATE TYPE param_type_t AS ENUM (
    'int',
    'json',
    'array',
    'string',
    'object',
    'null',
    'boolean',
    'number',
    'integer'
  );

  ALTER TABLE param ALTER COLUMN type TYPE param_type_t USING type::param_type_t;
  `;

  return knex.raw(query);
};

exports.down = function(knex) {
  const query = `
  DELETE FROM method_param;
  DELETE FROM param;
  ALTER TABLE param ALTER COLUMN type TYPE VARCHAR;
  DROP TYPE param_type_t;
  
  CREATE TYPE param_type AS ENUM (
    'int',
    'json',
    'array',
    'string',
    'object',
    'null',
    'boolean'
  );

  ALTER TABLE param ALTER COLUMN type TYPE param_type USING type::param_type;
  `;

  return knex.raw(query);

};

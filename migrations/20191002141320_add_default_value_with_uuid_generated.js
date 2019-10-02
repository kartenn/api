
exports.up = function(knex) {
  const query = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  ALTER TABLE project ALTER COLUMN project_uuid SET DEFAULT gen_random_uuid();
  ALTER TABLE method ALTER COLUMN method_uuid SET DEFAULT gen_random_uuid();
  ALTER TABLE event ALTER COLUMN event_uuid SET DEFAULT gen_random_uuid();
  ALTER TABLE param ALTER COLUMN param_uuid SET DEFAULT gen_random_uuid();
  `;

  return knex.raw(query);
};

exports.down = function(knex) {
  const query = `
  ALTER TABLE project ALTER COLUMN project_uuid DROP DEFAULT;
  ALTER TABLE method ALTER COLUMN method_uuid DROP DEFAULT;
  ALTER TABLE event ALTER COLUMN event_uuid DROP DEFAULT;
  ALTER TABLE param ALTER COLUMN param_uuid DROP DEFAULT;
  DROP EXTENSION pgcrypto;
  `;

  return knex.raw(query);
};

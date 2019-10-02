
exports.up = function(knex) {
  const query = `
  ALTER TABLE project ADD COLUMN disk_usage integer;
  `;

  return knex.raw(query);
};

exports.down = function(knex) {
  const query = `
  ALTER TABLE project DROP COLUMN disk_usage;
  `;

  return knex.raw(query);
};

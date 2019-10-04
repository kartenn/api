
exports.up = function(knex) {
    const query = `
  ALTER TABLE method ADD COLUMN type VARCHAR DEFAULT NULL;
  `;

    return knex.raw(query);
};

exports.down = function(knex) {
    const query = `
  ALTER TABLE method DROP COLUMN type;
  `;

    return knex.raw(query);
};

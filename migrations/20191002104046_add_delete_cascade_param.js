
exports.up = function(knex) {

  const query = `
  ALTER TABLE method_param DROP CONSTRAINT method_param_param_uuid_fkey;
  ALTER TABLE method_param DROP CONSTRAINT method_param_method_uuid_fkey;
  ALTER TABLE method_param ADD FOREIGN KEY ("method_uuid") REFERENCES "method" ("method_uuid") ON DELETE CASCADE ;
  ALTER TABLE method_param ADD FOREIGN KEY ("param_uuid") REFERENCES "param" ("param_uuid") ON DELETE CASCADE ;
  `;

  return knex.raw(query);
};

exports.down = function(knex) {

  const query = `
  ALTER TABLE method_param DROP CONSTRAINT method_param_param_uuid_fkey;
  ALTER TABLE method_param DROP CONSTRAINT method_param_method_uuid_fkey;
  ALTER TABLE "method_param" ADD FOREIGN KEY ("param_uuid") REFERENCES "param" ("param_uuid");
  ALTER TABLE method_param ADD FOREIGN KEY ("method_uuid") REFERENCES "method" ("method_uuid");
  `;

  return knex.raw(query);

};


exports.up = function(knex) {
  const query = `
  ALTER TABLE event_param DROP CONSTRAINT event_param_param_uuid_fkey;
  ALTER TABLE event_param DROP CONSTRAINT event_param_event_uuid_fkey;
  ALTER TABLE event_param ADD FOREIGN KEY ("event_uuid") REFERENCES "event" ("event_uuid") ON DELETE CASCADE ;
  ALTER TABLE event_param ADD FOREIGN KEY ("param_uuid") REFERENCES "param" ("param_uuid") ON DELETE CASCADE ;
  `;

  return knex.raw(query);
};

exports.down = function(knex) {
  const query = `
  ALTER TABLE event_param DROP CONSTRAINT event_param_param_uuid_fkey;
  ALTER TABLE event_param DROP CONSTRAINT event_param_event_uuid_fkey;
  ALTER TABLE "event_param" ADD FOREIGN KEY ("param_uuid") REFERENCES "param" ("param_uuid");
  ALTER TABLE event_param ADD FOREIGN KEY ("event_uuid") REFERENCES "event" ("event_uuid");
  `;

  return knex.raw(query);
};

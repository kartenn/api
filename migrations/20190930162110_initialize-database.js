
exports.up = function(knex) {
  const query = `
  CREATE TYPE "project_type" AS ENUM (
    'api',
    'gateway',
    'service',
    'webhook',
    'worker'
  );
  CREATE TYPE "param_type" AS ENUM (
    'int',
    'json',
    'array',
    'string',
    'object',
    'null',
    'boolean'
  );
  CREATE TABLE "project" (
    "project_uuid" uuid PRIMARY KEY,
    "name" varchar,
    "url_repository" varchar,
    "id_repository" integer,
    "code_owners" varchar[],
    "languages" varchar[],
    "slack_room" varchar,
    "dev_alias" varchar,
    "has_read_me" boolean,
    "type" project_type,
    created_ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_ts TIMESTAMPTZ NOT NULL DEFAULT '-infinity'
  );
  CREATE TABLE "method" (
    "method_uuid" uuid PRIMARY KEY,
    "project_uuid" uuid,
    "name" varchar,
    "response" json
  );
  CREATE TABLE "event" (
    "event_uuid" uuid PRIMARY KEY,
    "project_uuid" uuid,
    "name" varchar,
    "exchange" varchar,
    "domain" varchar
  );
  CREATE TABLE "param" (
    "param_uuid" uuid PRIMARY KEY,
    "name" varchar,
    "description" varchar,
    "required" boolean,
    "type" param_type
  );
  CREATE TABLE "method_param" (
    "param_uuid" uuid,
    "method_uuid" uuid,
    CONSTRAINT method_param_pk PRIMARY KEY (param_uuid, method_uuid)
  );
  CREATE TABLE "event_param" (
    "param_uuid" uuid,
    "event_uuid" uuid,
    CONSTRAINT event_param_pk PRIMARY KEY (param_uuid, event_uuid)
  );
  CREATE TABLE "project_calls_project" (
    "caller_project_uuid" uuid,
    "called_project_uuid" uuid,
    "method_uuid" uuid,
    CONSTRAINT project_calls_project_pk PRIMARY KEY (caller_project_uuid, called_project_uuid)
  );
  CREATE TABLE "project_listens_to_event" (
    "listening_project_uuid" uuid,
    "listened_event_uuid" uuid,
    CONSTRAINT project_listens_to_event_pk PRIMARY KEY (listening_project_uuid, listened_event_uuid)
  );
  ALTER TABLE "method" ADD FOREIGN KEY ("project_uuid") REFERENCES "project" ("project_uuid");
  ALTER TABLE "event" ADD FOREIGN KEY ("project_uuid") REFERENCES "project" ("project_uuid");
  ALTER TABLE "method_param" ADD FOREIGN KEY ("param_uuid") REFERENCES "param" ("param_uuid");
  ALTER TABLE "method_param" ADD FOREIGN KEY ("method_uuid") REFERENCES "method" ("method_uuid");
  ALTER TABLE "event_param" ADD FOREIGN KEY ("param_uuid") REFERENCES "param" ("param_uuid");
  ALTER TABLE "event_param" ADD FOREIGN KEY ("event_uuid") REFERENCES "event" ("event_uuid");
  ALTER TABLE "project_calls_project" ADD FOREIGN KEY ("caller_project_uuid") REFERENCES "project" ("project_uuid");
  ALTER TABLE "project_calls_project" ADD FOREIGN KEY ("called_project_uuid") REFERENCES "project" ("project_uuid");
  ALTER TABLE "project_calls_project" ADD FOREIGN KEY ("method_uuid") REFERENCES "method" ("method_uuid");
  ALTER TABLE "project_listens_to_event" ADD FOREIGN KEY ("listening_project_uuid") REFERENCES "project" ("project_uuid");
  ALTER TABLE "project_listens_to_event" ADD FOREIGN KEY ("listened_event_uuid") REFERENCES "event" ("event_uuid");
  `;

  return knex.raw(query);
};

exports.down = function(knex) {

};

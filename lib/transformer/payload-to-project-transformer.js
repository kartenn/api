'use strict';

const uuidv4 = require('uuid/v4');

module.exports = (payload) => {
  const { repository } = payload;

  return {
    project_uuid: uuidv4(),
    name: repository.name,
    url_repository: repository.html_url,
    id_repository: repository.id,
    code_owners: [repository.owner.login],
    languages: null,
    slack_room: null,
    dev_alias: null,
    has_read_me: false,
    type: null,
  };
};

'use strict';

const getURL = (name) => {
  switch (name) {
    case 'tfm-api':
        return 'https://' + name + '.theforkmanager.com/';
    default:
      return 'https://' + name + '.thefork.io/';
  }
};

module.exports = { getURL };

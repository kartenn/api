'use strict';

const config = require('config');

module.exports = config.get('db.master');

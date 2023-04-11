'use strict';

global.mongoose = require('mongoose');

module.exports = () => {
  mongoose.set('debug', true);
  return mongoose.connect('mongodb://localhost/ms_balance');
}

'use strict';

const mongoose = require('mongoose');
global.mongoose = mongoose;

module.exports = () => {
  mongoose.set('debug', true);
  mongoose.connect('mongodb://localhost/ms_balance');
}

'use strict';

const path = require('path');
const {sync_readdir} = require('./lib/function');
require('./lib/mongo')();
const importlib = require('./lib/import');

(async() => {
  let files = await sync_readdir(path.join(__dirname, 'exported'));
  for(let file of files) {
    let filename = path.basename(file, path.extname(file));
    const model = require(path.join(__dirname, 'models', filename));
    await importlib.to_mongodb(path.join(__dirname, 'exported', file), false, model);
  }
  process.exit()
})()
.catch(err => {
  console.log(err);
})
'use strict';

const fs = require('fs');

function sync_readdir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    })
  })
}

module.exports = {sync_readdir}
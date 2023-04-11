'use strict';

const fs = require('fs');
const async = require('async');
const path = require('path');

/**
 * 
 * @param {*} file_path [String] Set file path.
 * @param {*} async_limit [Integer] Set async limit in a time. Default 10.
 * @param {*} delete_file [Boolean] Set true/false to delete file after import.
 * @param {*} insert_function [Function] Set function to import data.
 */
exports.to_mongodb = (file_path, async_limit, delete_file = false, insert_function) => new Promise((resolve, reject) => {
  let filename = path.basename(file_path);
  if(!fs.existsSync(file_path)) {
    reject('File not found! [' + file_path + ']');
  } else {
    let readStream = fs.createReadStream(file_path, {encoding: 'utf8'});
    let regex = /{(("\w+"):(("([^"\\]|\\.)*")|(\w+)),?)*}/g;
    let chunks = '';
    let temp;
    let counter = 0;

    readStream.on('data', async (data) => {
      try {
        chunks += data;
        data = null;
        temp = chunks.match(regex);

        if(temp !== null) {
          counter += temp.length;
        }
        
        chunks = chunks.replace(regex, '');
        chunks = chunks.slice(chunks.search(/{/));
        readStream.pause();
        await insert(temp, async_limit, insert_function);  
        readStream.resume();
      } catch (error) {
        reject(error);
      }
    });

    readStream.on('end', () => {
      if(delete_file) {
        fs.unlinkSync(file_path);
      }
      console.log('Finish Importing...', filename, counter);
      resolve(true);
    });
  }
}) 

let insert = (temp, async_limit, insert_function) => new Promise((resolve, reject) => {
  async.mapLimit(temp, async_limit, async (e) => {
    try {
      e = JSON.parse(e);
      await insert_function(e);
      return 'done';  
    } catch (error) {
      reject(error);
    }
  }, (err, res) => {
    if(err){
      reject(err);
    } else {
      resolve();
    }
  });
})
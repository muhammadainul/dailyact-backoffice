'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 
 * @param {*} file_path [String] Set file path.
 * @param {*} delete_file [Boolean] Set true/false to delete file after import.
 * @param {*} insert_function [Function] Set function to import data.
 */
/* exports.to_mongodb = (file_path, delete_file = false, insert_function) => new Promise((resolve, reject) => {
  let filename = path.basename(file_path);
  if(!fs.existsSync(file_path)) {
    reject('File not found! [' + file_path + ']');
  } else {
    let readStream = fs.createReadStream(file_path, {encoding: 'utf8'});
    let regex = /{(("\w+"):(("([^"\\]|\\.)*")|(\w+)),?)*}/g;
    let chunks = '';
    let temp;
    let counter = 0;

    readStream.on('open', () => {
      console.log('Start to import', filename);
    })

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
        temp = temp.map(e => {
          e = JSON.parse(e)
          return e;
        });
        await insert_function(temp);
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
}) */

exports.to_mongodb = (file_path, delete_file = false, model) => new Promise((resolve, reject) => {
  let filename = path.basename(file_path);
  if(!fs.existsSync(file_path)) {
    reject('File not found! [' + file_path + ']');
  } else {
    let readStream = fs.createReadStream(file_path, {encoding: 'utf8'});
    let regex = /{(("\w+"):(("([^"\\]|\\.)*")|(\w+)),?)*}/g;
    let chunks = '';
    let temp;
    let counter = 0;

    readStream.on('open', () => {
      console.log('Start to import', filename);
    })

    readStream.on('data', async (data) => {
      try {
        chunks += data;
        data = null;
        temp = chunks.match(regex);

        counter += temp.length;
        
        chunks = chunks.replace(regex, '');
        chunks = chunks.slice(chunks.search(/{/));
        readStream.pause();
        temp = temp.map(e => {
          e = JSON.parse(e)
          return e;
        });
        await sync_create(model, temp);
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

function sync_create(model, data) {
  return new Promise((resolve, reject) => {
    model.create(data, (err, res) => {
      if (err) {
        console.log(err)
        process.exit()
        reject(err)
      } else {
        resolve();
      }
    })
  })
}
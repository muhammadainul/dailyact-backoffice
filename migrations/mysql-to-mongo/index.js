'use strict';

require('./lib/mongo')();
const async = require('async');
const ImportDB = require('./lib/import');
const Balance = require('./lib/balance');
const log4js = require('log4js');

log4js.configure({
  appenders: [
    {
      type: 'file',
      filename: 'balance.log',
      category: 'balance'
    }
  ]
});
global.logger = log4js.getLogger('balance');

let exportedfile = (filename) => {
  return './exported/' + filename + '.json';
}

(async() => {
  let unlink_file = false;
  let async_limit = 10;

  async.parallel([
    function(callback) {
      return (async() => {
        await ImportDB.to_mongodb(exportedfile('member_balance_gold'), async_limit, unlink_file, Balance.import_member_balance_golds);
        callback(null, 'done');
      })().catch(e => {
        callback(e);
      });
    },
    function(callback) {
      return (async() => {
        await ImportDB.to_mongodb(exportedfile('member_balance_idr'), async_limit, unlink_file, Balance.import_member_balance_idrs);
        callback(null, 'done');
      })().catch(e => {
        callback(e);
      });
    },
    function(callback) {
      return (async() => {
        await ImportDB.to_mongodb(exportedfile('stock_history'), async_limit, unlink_file, Balance.import_stock_histories);
        callback(null, 'done');
      })().catch(e => {
        callback(e);
      });
    },
    function(callback) {
      return (async() => {
        await ImportDB.to_mongodb(exportedfile('stock'), async_limit, unlink_file, Balance.import_stocks);
        callback(null, 'done');
      })().catch(e => {
        callback(e);
      });
    }
  ], (err, res) => {
    if(err) console.log(err);
    console.log('[ALL DONE]');
  })

})().catch(e => console.log(e));

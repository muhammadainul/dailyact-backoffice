'use strict';

const addmodel = (modelname) => {
  return require('../model/' + modelname);
};

const request = require('request');
const member_balance_gold = addmodel('member_balance_gold');
const member_balance_idr = addmodel('member_balance_idr');
const stock_history = addmodel('stock_history');
const stock = addmodel('stock');

let get_member_object_id = (member_id) => new Promise((resolve, reject) => {
  request.post('http://localhost:2010/service/get_member_object_id', {form: {member_id: Number(member_id)}}, (err, _, body) => {
    if(err) reject(err);
    if(body === null) {
      logger.error('Not found member id: ' + member_id);
      resolve(null);
    } else {
      resolve(JSON.parse(body).data);
    }
  });
});

let get_product_object_id = (product_id) => new Promise((resolve, reject) => {
  request.post('http://localhost:2009/service/get_product_object_id', {form: {product_id: Number(product_id)}}, (err, _, body) => {
    if(err) reject(err);
    if(body === null) {
      logger.error('Not found product id: ' + product_id);
      resolve(null);
    } else {
      resolve(JSON.parse(body).data);
    }
  });
});

let get_trx_object_id = (trx_id) => new Promise((resolve, reject) => {
  request.post('http://localhost:2007/service/get_trx_object_id', {form: {trx_id: Number(trx_id)}}, (err, _, body) => {
    if(err) reject(err);
    if(body === null) {
      logger.error('Not found trx id: ' + trx_id);
      resolve(null);
    } else {
      resolve(JSON.parse(body).data);
    }
  });
});

exports.import_member_balance_golds = (o) => new Promise(async (resolve) => {
  o.member_id = await get_member_object_id(o.member_id);
  o.product_id = await get_product_object_id(o.product_id);
  member_balance_gold.create(o, (err, res) => {
    if(err) reject(err);
    resolve();
  });
});

exports.import_member_balance_idrs = (o) => new Promise(async (resolve, reject) => {
  o.member_id = await get_member_object_id(o.member_id);
  member_balance_idr.create(o, (err, res) => {
    if(err) reject(err);
    resolve();
  });
});

exports.import_stock_histories = (o) => new Promise(async (resolve, reject) => {

  o.trx_id = await get_trx_object_id(o.trx_id);
  o.product_id = await get_product_object_id(o.product_id);
  stock_history.create(o, (err, res) => {
    if(err) reject(err);
    resolve();
  });
});

exports.import_stocks = (o) => new Promise(async (resolve, reject) => {
  o.product_id = await get_product_object_id(o.product_id);
  stock.create(o, (err, res) => {
    if(err) reject(err);
    resolve();
  });
});


'use strict';

let Schema = mongoose.Schema;

let Model = new Schema({
  trx_id: {
    type: Schema.Types.Mixed
  },
  product_id: {
    type: Schema.Types.Mixed
  },
  type: {
    type: String,
    enum: ['in', 'out']
  },
  total_gram: {
    type: Number
  },
  price_in_gram: {
    type: Number
  },
  total_price: {
    type: Number
  },
  created_date: {
    type: Date,
    set: v => {
      if(new Date(v) == 'Invalid Date') {
        return null;
      }
      return v;
    }
  }
});

module.exports = mongoose.model('stock_history', Model);

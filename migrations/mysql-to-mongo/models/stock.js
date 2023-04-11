'use strict';

let Schema = mongoose.Schema;

let Model = new Schema({
  product_id: {
    type: Schema.Types.Mixed
  },
  harga_modal: {
    type: Number
  },
  current_stock: {
    type: Number
  },
  max_stock: {
    type: Number
  },
  updated_date: {
    type: Date,
    set: v => {
      if(new Date(v) == 'Invalid Date') {
        return null;
      }
      return v;
    }
  }
});

module.exports = mongoose.model('stock', Model);


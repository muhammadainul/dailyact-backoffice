'use strict';

let Schema = mongoose.Schema;

let Model = new Schema({
  member_id: {
    type: Schema.Types.Mixed
  },
  product_id: {
    type: Schema.Types.Mixed
  },
  balance_gold: {
    type: Number
  },
  lock_balance: {
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

module.exports = mongoose.model('member_balance_gold', Model);

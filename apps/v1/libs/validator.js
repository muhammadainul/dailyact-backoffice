'use strict';

exports.isObjectId = (id) => {
  let pattern = /^[a-fA-F0-9]{24}$/;
  return pattern.test(id);
}
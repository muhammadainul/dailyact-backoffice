'use strict';

module.exports = (err) => {

  let error = {}
  switch(err.name) {
    case 'CastError': {
      error = {
        message: err.path + ' is not valid.',
        code: 400
      }
      break;
    }
    case 'ValidationError': {
      let errors = [];
      for(let i in err.errors) {
        if(err.errors[i].name == 'CastError') {
          errors.push(err.errors[i].path + ' is not valid.');
        } else {
          errors.push(err.errors[i].message);
        }
      }
      error = {
        message: errors,
        code: 400
      }
      break;
    }
    default: {
      error = err;
      break;
    }
  }
  
  return error;

}
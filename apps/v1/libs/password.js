'use strict'
const randomstring = require("randomstring")
const crypto = require('crypto')
const passwordValidator = require("password-validator");

exports.encrypt_data = function (data) {
    let enc_data = crypto.createHash('md5').update(data).digest("Base64")
    enc_data = new Buffer(enc_data, 'Base64').toString('hex')
    return enc_data
}
// require('make-runnable')

//[Mudita]: Create Encrypt Password with random salt
let encrypt_password = (pwd, salt = '')=>{
    if(salt == '')
        salt = randomstring.generate({
            length: 6,
            charset: 'alphanumeric'
        })
    return '$' + salt + '$.' + crypto.createHash('sha256').update(salt+pwd).digest('base64')
}

exports.encrypt_password = ( pwd )=> {
    return encrypt_password(pwd)
};

exports.check_password = function(encpwd, pwd){
    encpwd = encpwd.toString()
    let salt = encpwd.substr(1,6)
    return (encrypt_password(pwd, salt) === encpwd)
}

exports.validate_password = pwd => {
    var schema = new passwordValidator();
    schema
        .is().min(8)
        .is().max(100)
        .has().uppercase()
        .has().lowercase()
        .has().symbols()
        .has().digits()
        .has().not().spaces();

    return schema.validate(pwd);
};
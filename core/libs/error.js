var _super = Error.prototype,
    method = MyError.prototype = Object.create( _super );

method.constructor = MyError;

function MyError() {
    _super.constructor.apply( this, arguments );
}

function MyError(message, code) {
    _super.constructor.apply( this, arguments );
    this.message = message || 'Default Message'
    this.code = code
}

module.exports = MyError;
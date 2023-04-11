const jwt                                  = require("jsonwebtoken");
const debug                                = require("debug");
const { ObjectId }                         = mongoose.SchemaTypes;
const { encrypt_password, check_password } = require("../libs/password");

const UserDetail = require("./userdetail");
const Administration = require("./administration");

var userSchema = new mongoose.Schema(
    {
        username: {
            type     : String,
            unique   : true,
            required : true,
            trim     : true
        },
        // passport.js stuff. future proof for facebook and google. disable twitter for now
        local: {
            email         : String,
            password      : String,
            access_token  : String,
            refresh_token : String
        },
        facebook: {
            id            : String,
            access_token  : String,
            refresh_token : String,
            name          : String,
            email         : String
        },
        // twitter          : {
        //     id           : String,
        //     token        : String,
        //     displayName  : String,
        //     username     : String
        // },
        google: {
            id            : String,
            access_token  : String,
            refresh_token : String,
            email         : String,
            name          : String
        },
        country_code : String,
        mobile       : String,
        otpCode      : String,
        verifyOTP    : {
            type    : Boolean,
            default : false
        },
        enabled: {
            type    : Boolean,
            default : true
        },
        accountNonExpired: {
            type    : Boolean,
            default : true
        },
        accountNonLocked: {
            type    : Boolean,
            default : true
        },
        resetPassword: {
            Token   : String,
            Expires : Date
        },
        loginRetries: {
            retries            : Number,
            last_try           : Date,
            last_penalty       : Number,
            next_allowed_login : Date
        },
        admin: {
            type    : Boolean,
            default : false
        },
        administration: {
            type    : ObjectId,
            default : null,
            ref: "Administration"
        },
        userDetail : { type: ObjectId, ref: "UserDetail", default: null }
    },
    {
        timestamps : true
    }
);

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return encrypt_password(password, myConfig.session_secret);
};

// checking if password is valid
userSchema.methods.checkPassword = (encpwd, pwd) => {
    let log = debug("userSchema:checkPassword");
    log("encpwd, pwd", { encpwd, pwd });
    return check_password(encpwd, pwd);
};

// method to generate a JWT
userSchema.methods.generateJWT = function(days) {
    var today = new Date();
    var exp   = new Date(today);
    exp.setDate(today.getDate() + days);
    return jwt.sign(
        {
            id       : this._id,
            username : this.username,
            admin    : this.admin,
            exp      : parseInt(exp.getTime() / 1000)
        },
        myConfig.session_secret
    );
};

// auth (generate tokens) and then return user as json object
userSchema.methods.toAuthJSON = function() {
    this.local.access_token  = this.generateJWT(30);
    this.local.refresh_token = this.generateJWT(60);
    return {
        id       : this._id,
        username : this.username,
        local    : {
            email : this.local.email
            // access_token: this.local.access_token,
            // refresh_token: this.local.refresh_token
        },
        facebook: {
            id            : this.facebook.id,
            access_token  : this.facebook.access_token,
            refresh_token : this.facebook.refresh_token,
            name          : this.facebook.name,
            email         : this.facebook.email
        },
        google: {
            id            : this.google.id,
            access_token  : this.google.access_token,
            refresh_token : this.google.refresh_token,
            email         : this.google.email,
            name          : this.google.name
        },
        country_code      : this.country_code,
        mobile            : this.mobile,
        enabled           : this.enabled,
        verifyOTP         : this.verifyOTP,
        resetPassword     : this.resetPassword,
        accountNonExpired : this.accountNonExpired,
        accountNonLocked  : this.accountNonLocked,
        access_token      : this.local.access_token,
        refresh_token     : this.local.refresh_token,
        admin             : this.admin,
        detail            : this.userDetail
    };
};

userSchema.methods.toJSON = function() {
    return {
        id       : this._id,
        username : this.username,
        local    : {
            email         : this.local.email,
            access_token  : this.local.access_token,
            refresh_token : this.local.refresh_token
        },
        facebook: {
            id            : this.facebook.id,
            access_token  : this.facebook.access_token,
            refresh_token : this.facebook.refresh_token,
            name          : this.facebook.name,
            email         : this.facebook.email
        },
        google: {
            id            : this.google.id,
            access_token  : this.google.access_token,
            refresh_token : this.google.refresh_token,
            email         : this.google.email,
            name          : this.google.name
        },
        country_code      : this.country_code,
        mobile            : this.mobile,
        enabled           : this.enabled,
        verifyOTP         : this.verifyOTP,
        resetPassword     : this.resetPassword,
        accountNonExpired : this.accountNonExpired,
        accountNonLocked  : this.accountNonLocked,
        // access_token      : this.local.access_token,
        // refresh_token     : this.local.refresh_token,
        admin  : this.admin,
        detail : this.userDetail
    };
};

var User           = mongoose.model("User", userSchema);
    module.exports = User;

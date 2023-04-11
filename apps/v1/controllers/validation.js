"use strict";

const _ = require("lodash");
// const moment = require("moment");

// const { isMongoId } = require("validator");
const { oneOf, body, checkSchema } = require("express-validator/check");
const { validate_password } = require("../libs/password");

let validateString = field =>
    body(field)
        .exists()
        .withMessage("No " + field + " provided")
        .isString("Not a string")
        .isLength({ min: 1 })
        .withMessage("Please fill in the " + field);

let validateEmail = body("email")
    .exists()
    .withMessage("No email provided")
    .isString()
    .withMessage("Not a string")
    .isEmail()
    .withMessage("Not a valid email format");

let validatePassword = body("password")
    .exists()
    .withMessage("Password required")
    .isString()
    .withMessage("Not a string")
    .custom((password, { req }) => {
        if (!validate_password(password)) {
            throw new Error(
                "Password does not meet requirements: " +
                    "(8-100 characters, has an uppercase letter, has a symbol, a digit, and no spaces)"
            );
        }
        if (password !== req.body.password2) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    });

let validateRemember = body("remember")
    .optional()
    .isBoolean()
    .withMessage("Not a boolean");

let adminUserUpdate = checkSchema({
    // required id
    userid: {
        exists: true,
        isMongoId: true,
        errorMessage: "Not a valid MongoId"
    },
    // data tobe updated
    username: {
        isString: true,
        errorMessage: "Not a String"
    },
    email: {
        isEmail: true,
        errorMessage: "Not a valid email address"
    },
    country_code: {
        isString: true,
        errorMessage: "Not a String"
    },
    mobile: {
        isString: true,
        errorMessage: "Not a String"
    },
    verifyotp: {
        isBoolean: true,
        errorMessage: "Not a Boolean",
        toBoolean: true
    },
    enabled: {
        isBoolean: true,
        errorMessage: "Not a Boolean",
        toBoolean: true
    },
    accountNonExpired: {
        isBoolean: true,
        errorMessage: "Not a Boolean",
        toBoolean: true
    },
    accountNonLocked: {
        isBoolean: true,
        errorMessage: "Not a Boolean",
        toBoolean: true
    },
    admin: {
        isBoolean: true,
        errorMessage: "Not a Boolean",
        toBoolean: true
    }
});

let adminUserDetailUpdate = checkSchema({
    // required id
    userid: {
        exists: true,
        isMongoId: true,
        errorMessage: "Not a valid MongoId"
    },
    // data tobe updated
    firstname: {
        isString: true,
        errorMessage: "Not a String"
    },
    lastname: {
        isString: true,
        errorMessage: "Not a String"
    },
    sex: {
        isString: true,
        errorMessage: "Not a String"
    },
    hobbies: {
        isString: true,
        errorMessage: "Not a String"
    },
    birthday: {
        isISO8601: true,
        errorMessage: "Not a valid date",
        toDate: true
    },
    isprivate: {
        isBoolean: true,
        errorMessage: "Not a Boolean",
        toBoolean: true
    }
});

// EXPORTS
exports.register = [validateEmail, validatePassword];
exports.login = [validateString("username"), validateString("password"), validateRemember];
exports.adminUserUpdate = [adminUserUpdate];
exports.adminUserDetailUpdate = [adminUserDetailUpdate];

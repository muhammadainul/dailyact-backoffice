"use strict";

const _ = require("lodash");

const { sanitizeBody } = require("express-validator/filter");

let toLower = field => sanitizeBody(field).customSanitizer(str => _.toLower(str));
let toBoolean = field => sanitizeBody(field).toBoolean();

let password = sanitizeBody("password").toString();

// EXPORTS
exports.register = [toLower("email")];
exports.login = [toBoolean("remember")];

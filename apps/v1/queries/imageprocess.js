"use strict";

const debug = require("debug");
const _     = require("lodash");
const jwt   = require("jsonwebtoken");

const { post } = require("../libs/request");
const service  = require("../config/service");

exports.visionCheck = imageUri =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:imageprocess:visionCheck");
        log("[DA][Query] check image with vision", { imageUri });
        try {
            let url     = service.imageprocess + "vision";
            let headers = {};
            let body    = { imageUri };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

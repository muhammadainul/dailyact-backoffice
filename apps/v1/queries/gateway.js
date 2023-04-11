"use strict";

const debug = require("debug");
const _     = require("lodash");
const jwt   = require("jsonwebtoken");

const { post } = require("../libs/request");
const service  = require("../config/service");

let generateJWT = () =>
    new Promise(async (resolve, reject) => {
        try {
            resolve(
                jwt.sign(
                    {
                        backoffice : true
                    },
                    myConfig.session_secret,
                    { expiresIn: 10 }
                )
            );
        } catch (error) {
            reject(error);
        }
    });

// Token
exports.getToken = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:gateway:getToken");
        log("[DA][Query] getToken");
        try {
            let url     = service.gateway + "token/get";
            let headers = {};
            let body    = {
                name       : "android",
                secret_key : "9bed6eb2-9e6c-4155-879c-c02227332826",
                brand      : "Android",
                device_id  : "1234567890",
                model      : "Web",
                os         : "PC",
                os_version : "1.0"
            };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

// Version
exports.getAllVersion = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:gateway:getAllVersion");
        log("[DA][Query] get all version", { data });
        try {
            let url     = service.gateway + "app/version/all";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            log("result", response);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.addVersion = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:gateway:addVersion");
        log("[DA][Query] add version", { data });
        try {
            let url     = service.gateway + "app/version/add";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.deleteVersion = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:gateway:deleteVersion");
        log("[DA][Query] delete version", { data });
        try {
            let url     = service.gateway + "app/version/delete";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

// Referral
exports.getAllReferral = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:gateway:getAllReferral");
        log("[DA][Query] get all referral", { data });
        try {
            let url     = service.gateway + "app/referral/all";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            log("result", response);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

"use strict";

const debug = require("debug");
const _     = require("lodash");

const { post } = require("../libs/request");
const service  = require("../config/service");

exports.getSubscribe = (data) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:web:getSubscribe");
        log("[DA][Query] get subscribe list", { data });
        try {
            let url     = service.web + "subscribe/list/bo";
            let headers = {};
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getContact = (data) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:web:getContact");
        log("[DA][Query] get contact list", { data });
        try {
            let url     = service.web + "contact/list/bo";
            let headers = {};
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });
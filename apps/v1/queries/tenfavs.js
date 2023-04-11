"use strict";

const debug = require("debug");
const _     = require("lodash");
const jwt   = require("jsonwebtoken");

const { post, postWithFiles } = require("../libs/request");
const service                 = require("../config/service");

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

exports.getAll = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:tenfavs:getAll");
        log("[DA][Query] get all tenfavs data");
        try {
            let url     = service.tenfavs + "get/all";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getStatistic = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:tenfavs:getStatistic");
        log("[DA][Query] get tenfavs statistic");
        try {
            let url     = service.tenfavs + "statistic/get";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            log("response", response.data);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getTenFavsList = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:tenfavs:getTenFavsList");
        log("[DA][Query] get a list of favorite", { data });
        try {
            let url     = services.tenfavs + "list/all";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.editTenFavs = ({ formData }) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:tenfavs:editTenFavs");
        log("[DA][Query] edit favorite", { formData });
        try {
            let url     = services.tenfavs + "backoffice/edit";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };

            log("url, headers, body", { url, headers, formData });
            let response = await postWithFiles(url, headers, formData);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

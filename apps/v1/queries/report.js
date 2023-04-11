"use strict";

const debug = require("debug");
const _     = require("lodash");

const Report = require("../models/report");

exports.check = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:report:check");
        log("[DA][Query] check report", data);
        try {
            let result = await Report.findOne(data);
            log("result", result);
            if (!_.isEmpty(result)) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

exports.add = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:report:addReport");
        log("[DA][Query] add new report", data);
        try {
            let result = await Report.create(data);
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

exports.getReport = (search, options) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getReport");
        log("[DA][Query] get report list", { search, options });
        try {
            let recordsTotal    = await Report.count();
            let recordsFiltered = await Report.count(search);
            let find            = await Report.find(search, null, options)
                .sort("-date")
                .populate("files")
                .lean();
            let result = { recordsFiltered, recordsTotal, data: find };
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });
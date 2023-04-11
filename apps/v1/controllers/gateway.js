"use strict";

const debug    = require("debug");
const _        = require("lodash");
const momenttz = require("moment-timezone");

let getAccessToken = async ({ authorization }) => {
    const log = debug("page:getAccessToken");
    let   str = _.split(authorization, " ");
    log("access token: Bearer", str[1]);
    return str[1];
};

// Token
exports.getToken = async (req, res, next) => {
    let log  = debug("bo:getToken");
    let data = req.body;
    log("[DA] getToken from gateway", data);
    try {
        let result = await req.queries("gateway").getToken();
        log("result", result);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

// Version
exports.versionPage = async (req, res, next) => {
    const log = debug("bo:versionPage");
    try {
        res.render("pages/gateway/version");
    } catch (error) {
        next(error);
    }
};

exports.getAllVersion = async (req, res, next) => {
    let log   = debug("bo:getAllVersion");
    let data  = req.body;
    log("[DA] get all versions", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "versionName";
        } else if (data.order[0].column == "2") {
            data.searchOrder = "releaseDate";
        } else if (data.order[0].column == "3") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await req.queries("gateway").getAllVersion(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.versionAdd = async (req, res, next) => {
    let log  = debug("bo:versionAdd");
    let data = req.body;
    log("[DA] add version", data);
    try {
        data.releaseDate = momenttz.tz(data.releaseDate, "Asia/Jakarta");
        let result = await req.queries("gateway").addVersion(data);
        res.redirect("/gateway/version/list");
    } catch (error) {
        next(error);
    }
};

exports.versionDelete = async (req, res, next) => {
    let log  = debug("bo:versionDelete");
    let data = req.body;
    log("[DA] delete version", data);
    try {
        let result = await req.queries("gateway").deleteVersion(data);
        res.redirect("/gateway/version/list");
    } catch (error) {
        next(error);
    }
};

// Referral
exports.referralPage = async (req, res, next) => {
    const log = debug("bo:referralPage");
    try {
        res.render("pages/gateway/referral");
    } catch (error) {
        next(error);
    }
};

exports.getAllReferral = async (req, res, next) => {
    let log   = debug("bo:getAllReferral");
    let data  = req.body;
    log("[DA] get all referrals", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "6") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await req.queries("gateway").getAllReferral(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

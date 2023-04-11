"use strict";

const debug = require("debug");
const _ = require("lodash");

let getAccessToken = async headers => {
    var log = debug("page:getAccessToken");
    let str = _.split(headers.authorization, " ");
    log("access token: Bearer ", str[1]);
    return { access_token: str[1] };
};

exports.subscribePage = async (req, res, next) => {
    let log = debug("bo:subscribePage");
    log("[DA] Render Subscribe Page");
    try {
        log("req.session", req.session);
        res.render("pages/web/subscribe");
    } catch (error) {
        next(error);
    }
};

exports.contactPage = async (req, res, next) => {
    let log = debug("bo:contactPage");
    log("[DA] Render Contact Page");
    try {
        log("req.session", req.session);
        res.render("pages/web/contact");
    } catch (error) {
        next(error);
    }
};

exports.getSubscribe = async (req, res, next) => {
    let log = debug("bo:getSubscribe");
    let data = req.body;
    log("[DA] get subscribe list", { data });
    try {
        data.searchOrder = "";
        if (data.order[0].column == "0") {
            data.searchOrder = "email";
        } else if (data.order[0].column == "3") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await req.queries("web").getSubscribe(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.getContact = async (req, res, next) => {
    let log = debug("bo:getContact");
    let data = req.body;
    log("[DA] get contact list", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "email";
        } else if (data.order[0].column == "4") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await req.queries("web").getContact(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};
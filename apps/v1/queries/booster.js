"use strict";

const debug = require("debug");
const _     = require("lodash");
const jwt   = require("jsonwebtoken");

const Booster = require("../models/booster");

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

exports.getAll = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:booster:getAll");
        log("[DA][Query] getAll booster");
        try {
            let result = await Booster.find({}).lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

exports.create = (userId, access_token) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:booster:create");
        log("[DA][Query] create booster", { userId, access_token });
        try {
            let result = await Booster.create({ userId, access_token });
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

exports.update = (userId, access_token) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:booster:update");
        log("[DA][Query] update booster", { userId, access_token });
        try {
            let result = await Booster.findOneAndUpdate({ userId }, { access_token });
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

exports.remove = userId =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:booster:remove");
        log("[DA][Query] remove booster", userId);
        try {
            let result = await Booster.remove({ userId });
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

exports.check = userId =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:booster:check");
        log("[DA][Query] check booster", userId);
        try {
            let result = await Booster.findOne({ userId });
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

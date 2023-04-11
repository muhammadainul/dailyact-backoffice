"use strict";

const debug = require("debug");
const _ = require("lodash");

const UserDetail = require("../models/userdetail");

exports.new = obj =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:detail:new");
        log("[DA][Query] add new user detail", obj);
        try {
            let result = UserDetail.create(obj);
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

exports.updateById = (id, toUpdate) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:detail:updateById");
        log("[DA][Query] update user detail by id", { id, toUpdate });
        try {
            let result = await UserDetail.findByIdAndUpdate(id, toUpdate, { new: true });
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

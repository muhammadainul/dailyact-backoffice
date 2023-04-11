const debug = require("debug");
const _ = require("lodash");

const Privilege = require("../models/privilege");

exports.add = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:privilege:add");
        log("[DA][Query] add new privilege", { data });
        try {
            let result = await Privilege.create(data);
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.getAll = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:privilege:getAll");
        log("[DA][Query] get all privilege roles");
        try {
            let result = await Privilege.find().lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.getById = id =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:privilege:getById");
        log("[DA][Query] get privilege by id", { id });
        try {
            let result = await Privilege.findById(id).lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.updateById = (id, toUpdate) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:privilege:updateById");
        log("[DA][Query] update privilege by id", { id, toUpdate });
        try {
            let result = await Privilege.findByIdAndUpdate(id, toUpdate, { new: true }).lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

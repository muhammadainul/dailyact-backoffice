const debug = require("debug");
const _ = require("lodash");

const Role = require("../models/role");

exports.add = ({ role, description }) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:role:add");
        log("[DA][Query] add new admin role", { role, description });
        try {
            let result = await Role.create({ role, description });
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.getAll = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:role:getAll");
        log("[DA][Query] get all admin roles");
        try {
            let result = await Role.find().lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.getById = id =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:role:getById");
        log("[DA][Query] get role by id", { id });
        try {
            let result = await Role.findById(id).lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.updateById = (id, toUpdate) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:role:updateById");
        log("[DA][Query] update role by id", { id, toUpdate });
        try {
            let result = await Role.findByIdAndUpdate(id, toUpdate, { new: true }).lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

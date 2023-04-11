"use strict";

const debug = require("debug");
const _     = require("lodash");
const jwt   = require("jsonwebtoken");

const User = require("../models/user");

const { post, get } = require("../libs/request");
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

// ADMIN
exports.new = obj =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:addUser");
        log("[DA][Query] add new admin user", obj);
        try {
            let result = await User.create(obj);
            log("result", result);
            resolve(result);
        } catch (error) {
            log("error", error);
            reject(error);
        }
    });

exports.getAll = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getAll");
        log("[DA][Query] get all admin user");
        try {
            let result = await User.find()
                .populate("userDetail")
                .lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.getById = id =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getById");
        log("[DA][Query] get admin user  by id", id);
        try {
            let result = await User.findById(id)
                .populate("userDetail")
                .lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.getByUsername = username =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getByUsername");
        log("[DA][Query] get by username", { username });
        try {
            let result = await User.findOne({ username }).populate("userDetail");
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.getByEmail = email =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getByEmail");
        log("[DA][Query] get by email", { email });
        try {
            let result = await User.findOne({ email }).populate("userDetail");
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.getByIdUsernameAndAdmin = (id, username, admin) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getByIdUsernameAndAdmin");
        log("[DA][Query] get by id, username, and admin", { id, username, admin });
        try {
            let result = await User.findOne({ _id: id, username, admin });
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.updateById = (id, toUpdate) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:updateById");
        log("[DA][Query] update user", { id, toUpdate });
        try {
            let result = await User.findByIdAndUpdate(id, toUpdate, { new: true })
                .populate("userDetail")
                .lean();
            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

exports.updateAccessToken = ({ id, username, access_token, refresh_token }) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:updateAccessToken");
        log("[DA][Query] updateAccessToken", { id, username });
        try {
            let toUpdateAccess        = { "local.access_token": access_token };
            let toUpdateAccessRefresh = {
                "local.access_token"  : access_token,
                "local.refresh_token" : refresh_token
            };
            if (_.isNil(refresh_token)) {
                var result = await User.findByIdAndUpdate(id, toUpdateAccess, { new: true })
                    .populate("userDetail")
                    .lean();
            } else {
                var result = await User.findByIdAndUpdate(id, toUpdateAccessRefresh, { new: true })
                    .populate("userDetail")
                    .lean();
            }

            if (_.isNil(id)) {
                var result = await User.findOneAndUpdate({ username }, toUpdateAccessRefresh, {
                    new : true
                })
                    .populate("userDetail")
                    .lean();
            }

            log("result", result);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

// USER SERVICE
exports.getAllUserData = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getAllUserData");
        log("[DA][Query] get all user data", { data });
        try {
            let url     = service.user + "all";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getAllUsers = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getAllUsers");
        log("[DA][Query] get all users");
        try {
            let url     = service.user + "data/all";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getUserData = userId =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getUserData");
        log("[DA][Query] get all user's data", { userId });
        try {
            let url     = service.user + "data";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { userId };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.updateMasterUser = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:updateMasterUser");
        log("[DA][Query] update user data", { data });
        try {
            let url     = service.user + "update";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

exports.addDetailUser = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:addDetailUser");
        log("[DA][Query] add user's detail", { data });
        try {
            let url     = service.user + "add/detail";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

exports.updateDetailUser = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:updateDetailUser");
        log("[DA][Query] update user's detail", { data });
        try {
            let url     = service.user + "update/detail";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

exports.updateEnableUser = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:updateEnableUser");
        log("[DA][Query] update user enable data", { data });
        try {
            let url     = service.user + "update/ban";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

exports.getSessionById = userId =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getSessionById");
        log("[DA][Query] get user's session data", { userId });
        try {
            let url     = service.user + "session";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { userId };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

exports.deleteSessionById = sessionId =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:deleteSessionById");
        log("[DA][Query] delete user's session data", { sessionId });
        try {
            let url     = service.user + "session/delete";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { sessionId };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

exports.deleteSessionByUserId = userId =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:deleteSessionByUserId");
        log("[DA][Query] delete all user's sessions data", { userId });
        try {
            let url     = service.user + "session/deleteall";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { userId };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

exports.register = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:register");
        log("[DA][Query] register new account", data);
        try {
            let url     = service.user + "v2/register";
            let headers = { "da-token": data.token };
            let body    = {
                email        : data.email,
                country_code : data.country_code,
                mobile       : data.mobile
            };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.login = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:login");
        log("[DA][Query] login to account", data);
        try {
            let url     = service.user + "v2/login";
            let headers = { "da-token": data.token };
            let body    = {
                email : data.email
            };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.logout = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:logout");
        log("[DA][Query] logout to account", data);
        try {
            let url     = service.user + "v2/logout/deviceByUserId";
            let headers = { "da-token": data.token };
            let body    = {
                userId : data.userId
            };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.loginOTP = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:loginOTP");
        log("[DA][Query] loginOTP to account", data);
        try {
            let url     = service.user + "v2/login/otp";
            let headers = { "da-token": data.token };
            let body    = {
                email : data.email,
                login_otp : data.login_otp
            };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getAllBizDevUser = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getAllBizDevUser");
        log("[DA][Query] get all bizdev user data", { data });
        try {
            let url     = service.user + "all/bizdev";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getStatistic = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:user:getStatistic");
        log("[DA][Query] get user statistic");
        try {
            let url     = service.user + "statistic/get";
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

exports.getDemography = () =>
new Promise(async (resolve, reject) => {
    var log = debug("queries:user:demography");
    log("[DA][Query] get user demography");
    try {
        let url     = service.user + "demography";
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

exports.getAllVerifData = (data) => 
new Promise(async (resolve, reject) => {
    var log = debug("queries:user:verification");
    log("[DA][Query] get user verification");
    try {
        let url     = service.user + "verification/get/review";
        let headers = { Authorization: "Bearer " + (await generateJWT()) };
        let body    = data;
        log("url, headers, body", { url, headers, body });
        let response = await post(url, headers, body);
        log("response", response.data);
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

exports.getVerificationData = ({ verificationId }) =>
new Promise(async (resolve, reject) => {
    var log = debug("queries:user:verificationData");
    log("[DA][Query] get user verification Data");
    try {
        let url     = service.user + "verification/get/id";
        let headers = { Authorization: "Bearer " + (await generateJWT()) };
        let body    = { verificationId };
        log("url, headers, body", { url, headers, body });
        let response = await post(url, headers, body);
        log("response", response.data);
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

exports.updateConfirmVerif = ({ verificationId, approved, reason }) =>
new Promise(async (resolve, reject) => {
    var log = debug("queries:user:verificationConfirm");
    log("[DA][Query] get verification update", { verificationId, approved, reason });
    try {
        let url     = service.user + "verification/response";
        let headers = { Authorization: "Bearer " + (await generateJWT()) };
        let body    = { verificationId, approved, reason };
        log("url, headers, body", { url, headers, body });
        let response = await post(url, headers, body);
        log("response", response.data);
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

exports.getLocationByLastActive = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:story:location by last active");
        log("[DA][Query] location by last active");
        try {
            let url     = service.user + "location/province";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            log("response", response.error);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });


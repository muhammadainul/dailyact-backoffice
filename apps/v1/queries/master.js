"use strict";

const debug = require("debug");
const _     = require("lodash");
const jwt   = require("jsonwebtoken");

const { post, postWithFiles } = require("../libs/request");

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

exports.getAllGender = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getAllGender");
        log("[DA][Query] get all gender from master");
        try {
            let url     = services.master + "backoffice/gender/get";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getGenderList = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getGenderList");
        log("[DA][Query] get a list of gender from master", { data });
        try {
            let url     = services.master + "backoffice/gender/list";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.addGender = gender =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:addGender");
        log("[DA][Query] add gender to master", { gender });
        try {
            let url     = services.master + "backoffice/gender/add";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { gender };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.deleteGender = gender =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:deleteGender");
        log("[DA][Query] delete gender from master", { gender });
        try {
            let url     = services.master + "backoffice/gender/remove";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { gender };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getReportList = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getReportList");
        log("[DA][Query] get a list of report from master", { data });
        try {
            let url     = services.master + "backoffice/report/list";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.addReport = report =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:addReport");
        log("[DA][Query] add report to master", { report });
        try {
            let url     = services.master + "backoffice/report/add";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { report };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.deleteReport = reportId =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:deleteReport");
        log("[DA][Query] delete report from master", { reportId });
        try {
            let url     = services.master + "backoffice/report/remove";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { reportId };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.checkReport = reason =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:checkReport");
        log("[DA][Query] check report reason from master", { reason });
        try {
            let url     = services.master + "report/check";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { reason };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getPostTypeList = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getPostTypeList");
        log("[DA][Query] get a list of post type from master", { data });
        try {
            let url     = services.master + "backoffice/posttype/list";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.addPostType = postType =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:addPostType");
        log("[DA][Query] add postType to master", { postType });
        try {
            let url     = services.master + "backoffice/posttype/add";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { postType };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.deletePostType = postType =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:deletePostType");
        log("[DA][Query] delete post type from master", { postType });
        try {
            let url     = services.master + "backoffice/posttype/remove";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { postType };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getAllIndicator = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getAllIndicator");
        log("[DA][Query] get all indicator from master");
        try {
            let url     = services.master + "backoffice/indicator/get";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getIndicatorList = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getIndicatorList");
        log("[DA][Query] get a list of indicator from master", { data });
        try {
            let url     = services.master + "backoffice/indicator/list";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.addIndicator = indicator =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:addIndicator");
        log("[DA][Query] add indicator to master", { indicator });
        try {
            let url     = services.master + "backoffice/indicator/add";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { indicator };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.deleteIndicator = indicator =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:deleteIndicator");
        log("[DA][Query] delete indicator from master", { indicator });
        try {
            let url     = services.master + "backoffice/indicator/remove";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { indicator };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getAllMood = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getAllMood");
        log("[DA][Query] get all mood from master");
        try {
            let url     = services.master + "backoffice/mood/get";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getMoodList = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getMoodList");
        log("[DA][Query] get a list of mood from master", { data });
        try {
            let url     = services.master + "backoffice/mood/list";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.addMood = mood =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:addMood");
        log("[DA][Query] add mood to master", { mood });
        try {
            let url     = services.master + "backoffice/mood/add";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { mood };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.deleteMood = mood =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:deleteMood");
        log("[DA][Query] delete mood from master", { mood });
        try {
            let url     = services.master + "backoffice/mood/remove";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { mood };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getPromoCodeList = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getPromoCodeList");
        log("[DA][Query] get a list of promocode from master", { data });
        try {
            let url     = services.master + "backoffice/promocode/list";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.addPromoCode = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:addPromoCode");
        log("[DA][Query] add promocode to master", data);
        try {
            let url     = services.master + "backoffice/promocode/add";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.deletePromoCode = code =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:deletePromoCode");
        log("[DA][Query] delete promocode from master", { code });
        try {
            let url     = services.master + "backoffice/promocode/remove";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { code };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.checkPromoCode = code =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:checkPromoCode");
        log("[DA][Query] check if promocode exists in master", { code });
        try {
            let url     = services.master + "backoffice/promocode/check";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = [code];
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getAllCategory = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getAllCategory");
        log("[DA][Query] get all category from master");
        try {
            let url     = services.master + "backoffice/category/get";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = {};
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getCategoryList = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:getCategoryList");
        log("[DA][Query] get a list of category from master", { data });
        try {
            let url     = services.master + "backoffice/category/list";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.addCategory = ({ formData }) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:addCategory");
        log("[DA][Query] add category to master", { formData });
        try {
            let url     = services.master + "category/add";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };

            log("url, headers, body", { url, headers, formData });
            let response = await postWithFiles(url, headers, formData);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.editCategory = ({ formData }) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:editCategory");
        log("[DA][Query] edit category master", { formData });
        try {
            let url     = services.master + "category/edit";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };

            log("url, headers, body", { url, headers, formData });
            let response = await postWithFiles(url, headers, formData);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.deleteCategory = ({ categoryId }) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:master:deleteCategory");
        log("[DA][Query] delete category from master", { categoryId });
        try {
            let url     = services.master + "category/remove";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = { categoryId };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

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

exports.getAllPostData = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:post:getAllPostData");
        log("[DA][Query] get all post data", { data });
        try {
            let url     = service.post + "all";
            let headers = { Authorization: "Bearer " + (await generateJWT()) };
            let body    = data;
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getPostData = (postId, access_token) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:post:getPostData");
        log("[DA][Query] get a post data", { postId, access_token });
        try {
            let url     = service.post + "get";
            let headers = { Authorization: "Bearer " + access_token };
            let body    = { postId };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.getPostExport = data =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:post:getPostExport");
        log("[DA][Query] get post data for export", { data });
        try {
            let url     = service.post + "get/export";
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

exports.getCommentData = (commentId, access_token) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:post:getCommentData");
        log("[DA][Query] get a comment data", { commentId, access_token });
        try {
            let url     = service.post + "comment/get";
            let headers = { Authorization: "Bearer " + access_token };
            let body    = { commentId };
            log("url, headers, body", { url, headers, body });
            let response = await post(url, headers, body);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });

exports.uploadPost = ({ datoken, access_token, form }) =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:post:uploadPost");
        log("[DA][Query] upload post", { datoken, access_token, form });
        try {
            let url     = service.post;
            let headers = {
                "da-token"    : datoken,
                Authorization : "Bearer " + access_token
            };
            let formData = form;
            log("url, headers, body", { url, headers, formData });
            let response = await postWithFiles(url, headers, formData);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

exports.addThumbnailPost = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:post:addThumbnailPost");
        log("[DA][Query] add thumbnail post images");
        try {
            let url     = service.post + "thumbnail/add";
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
        var log = debug("queries:post:getStatistic");
        log("[DA][Query] get post statistic");
        try {
            let url     = service.post + "statistic/get";
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

exports.getLocationByPost = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:post:location by post data");
        log("[DA][Query] location by post data");
        try {
            let url     = service.post + "location/province";
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

exports.getLocationByPostImageFile = () =>
    new Promise(async (resolve, reject) => {
        var log = debug("queries:post:location by post image file");
        log("[DA][Query] location by post image file");
        try {
            let url     = service.post + "location/province";
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


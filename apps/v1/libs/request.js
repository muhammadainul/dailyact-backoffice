"use strict";

const __request = require("request");

exports.post = (url, headers, body) => {
    return new Promise((resolve, reject) => {
        try {
            let options = {
                url     : url,
                headers : headers,
                body    : body,
                json    : true
            };
            __request.post(options, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

exports.postWithFiles = (url, headers, formData) => {
    return new Promise((resolve, reject) => {
        try {
            let options = {
                url      : url,
                headers  : headers,
                formData : formData
            };
            __request.post(options, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

exports.get = (url, headers, body) => {
    return new Promise((resolve, reject) => {
        try {
            let options = {
                url     : url,
                headers : headers,
                body    : body,
                json    : true
            };
            __request.get(options, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

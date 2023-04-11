"use strict";

const debug = require("debug");
const {
    find, //
    isEmpty,
    split
} = require("lodash");
const { Parser } = require("json2csv");

const Master  = require("../queries/master");
const TenFavs = require("../queries/tenfavs");

let getAccessToken = async headers => {
    var log = debug("page:getAccessToken");
    let str = split(headers.authorization, " ");
    log("access token: Bearer ", str[1]);
    return { access_token: str[1] };
};

exports.exportTenFavs = async (req, res, next) => {
    let log  = debug("bo:exportTenFavs");
    let data = req.body;
    log("[DA] export tenfavs", data);
    try {
        let options = {
            defaultValue : "none",
            fields       : [
                {
                    label : "Favorite Id",
                    value : "_id"
                },
                {
                    label : "Favorite Title",
                    value : "title"
                },
                {
                    label : "User Count",
                    value : "count"
                },
                {
                    label : "Category",
                    value : "interests"
                }
            ]
        };
        let csvData        = await TenFavs.getAll();
        let json2csvParser = new Parser(options);
        let result         = json2csvParser.parse(csvData);
        let path           = "uploads/[DA]TenFavs-" + new Date(Date.now()) + ".csv";
        await fs.writeFileSync(path, result);
        res.download(path);
    } catch (error) {
        next(error);
    }
};

exports.tenfavsPage = async (req, res, next) => {
    let log = debug("bo:tenfavsPage");
    log("[DA] Render TenFavs Page");
    try {
        log("req.session", req.session);
        res.render("pages/tenfavs/index");
    } catch (error) {
        next(error);
    }
};

exports.getTenFavsList = async (req, res, next) => {
    let log  = debug("bo:getTenFavsList");
    let data = req.body;
    log("[DA] get all favorite", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "title";
        } else if (data.order[0].column == "2") {
            data.searchOrder = "count";
        } else if (data.order[0].column == "4") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await TenFavs.getTenFavsList(data);
        log("result", result);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.editTenFavs = async (req, res, next) => {
    let log                                         = debug("bo:editTenFavs");
    let { files }                                   = req;
    let { tenfavsId, title, interests, isVerified } = req.body;
    log("[DA] edit a favorite", { files, tenfavsId, title, interests, isVerified });
    try {
        let categories  = await Master.getAllCategory();
        let interestsId = [];
        if (!isEmpty(interests)) {
            interests = split(interests, ",");
            interests.forEach(o => {
                let found = find(categories, { name: o });
                if (isEmpty(found)) {
                    return res.render("pages/tenfavs/index", {
                        error: {
                            title   : "Error! Please try again.",
                            message : o + " is not exists in categories."
                        }
                    });
                }
                interestsId.push(found._id);
            });
        }

        let fileData = [];
        if (!isEmpty(files)) {
            files.forEach(o => {
                fileData.push({
                    value   : fs.createReadStream(o.path),
                    options : {
                        filename    : o.originalname,
                        contentType : o.mimetype
                    }
                });
            });
        }
        let formData = {
            file       : fileData,
            favoriteId : tenfavsId,
            title,
            interests : interestsId,
            isVerified
        };
        let result = await TenFavs.editTenFavs({ formData });
        log("result", result);
        res.redirect("/tenfavs/list");
    } catch (error) {
        next(error);
    }
};

"use strict";

const debug = require("debug");
const {
    isEmpty, //
    split,
    toUpper
} = require("lodash");

const Master = require("../queries/master");

let getAccessToken = async headers => {
    var log = debug("page:getAccessToken");
    let str = split(headers.authorization, " ");
    log("access token: Bearer ", str[1]);
    return { access_token: str[1] };
};

exports.genderPage = async (req, res, next) => {
    let log = debug("bo:genderPage");
    log("[DA] Render Gender Page");
    try {
        log("req.session", req.session);
        res.render("pages/master/gender");
    } catch (error) {
        next(error);
    }
};

exports.getGenderList = async (req, res, next) => {
    let log  = debug("bo:getGenderList");
    let data = req.body;
    log("[DA] get all gender", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "sex";
        } else if (data.order[0].column == "2") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await Master.getGenderList(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.addGender = async (req, res, next) => {
    let log  = debug("bo:addGender");
    let data = req.body;
    log("[DA] add a gender", data);
    try {
        let result = await Master.addGender(data.gender);
        res.redirect("/master/gender");
    } catch (error) {
        next(error);
    }
};

exports.deleteGender = async (req, res, next) => {
    let log  = debug("bo:deleteGender");
    let data = req.body;
    log("[DA] delete a gender", data);
    try {
        let result = await Master.deleteGender(data.gender);
        res.redirect("/master/gender");
    } catch (error) {
        next(error);
    }
};

exports.reportPage = async (req, res, next) => {
    let log = debug("bo:reportPage");
    log("[DA] Render Report Page");
    try {
        log("req.session", req.session);
        res.render("pages/master/report");
    } catch (error) {
        next(error);
    }
};

exports.getReportList = async (req, res, next) => {
    let log  = debug("bo:getReportList");
    let data = req.body;
    log("[DA] get all report", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "title";
        } else if (data.order[0].column == "2") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await Master.getReportList(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.addReport = async (req, res, next) => {
    let log  = debug("bo:addReport");
    let data = req.body;
    log("[DA] add a report", data);
    try {
        let result = await Master.addReport(data.report);
        res.redirect("/master/report");
    } catch (error) {
        next(error);
    }
};

exports.deleteReport = async (req, res, next) => {
    let log  = debug("bo:deleteReport");
    let data = req.body;
    log("[DA] delete a report", data);
    try {
        let result = await Master.deleteReport(data.reportId);
        res.redirect("/master/report");
    } catch (error) {
        next(error);
    }
};

exports.postTypePage = async (req, res, next) => {
    let log = debug("bo:postTypePage");
    log("[DA] Render postType Page");
    try {
        log("req.session", req.session);
        res.render("pages/master/posttype");
    } catch (error) {
        next(error);
    }
};

exports.getPostTypeList = async (req, res, next) => {
    let log  = debug("bo:getPostTypeList");
    let data = req.body;
    log("[DA] get all postType", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "postType";
        } else if (data.order[0].column == "2") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await Master.getPostTypeList(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.addPostType = async (req, res, next) => {
    let log  = debug("bo:addPostType");
    let data = req.body;
    log("[DA] add a posttype", data);
    try {
        let result = await Master.addPostType(data.postType);
        res.redirect("/master/posttype");
    } catch (error) {
        next(error);
    }
};

exports.deletePostType = async (req, res, next) => {
    let log  = debug("bo:deletePostType");
    let data = req.body;
    log("[DA] delete a post type", data);
    try {
        let result = await Master.deletePostType(data.postType);
        res.redirect("/master/posttype");
    } catch (error) {
        next(error);
    }
};

exports.indicatorPage = async (req, res, next) => {
    let log = debug("bo:indicatorPage");
    log("[DA] Render Indicator Page");
    try {
        log("req.session", req.session);
        res.render("pages/master/indicator");
    } catch (error) {
        next(error);
    }
};

exports.getIndicatorList = async (req, res, next) => {
    let log  = debug("bo:getIndicatorList");
    let data = req.body;
    log("[DA] get all indicator", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "indicator";
        } else if (data.order[0].column == "2") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await Master.getIndicatorList(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.addIndicator = async (req, res, next) => {
    let log  = debug("bo:addIndicator");
    let data = req.body;
    log("[DA] add an indicator", data);
    try {
        let result = await Master.addIndicator(data.indicator);
        res.redirect("/master/indicator");
    } catch (error) {
        next(error);
    }
};

exports.deleteIndicator = async (req, res, next) => {
    let log  = debug("bo:deleteIndicator");
    let data = req.body;
    log("[DA] delete an indicator", data);
    try {
        let result = await Master.deleteIndicator(data.indicator);
        res.redirect("/master/indicator");
    } catch (error) {
        next(error);
    }
};

exports.moodPage = async (req, res, next) => {
    let log = debug("bo:moodPage");
    log("[DA] Render Mood Page");
    try {
        log("req.session", req.session);
        res.render("pages/master/mood");
    } catch (error) {
        next(error);
    }
};

exports.getMoodList = async (req, res, next) => {
    let log  = debug("bo:getMoodList");
    let data = req.body;
    log("[DA] get all mood", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "mood";
        } else if (data.order[0].column == "2") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await Master.getMoodList(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.addMood = async (req, res, next) => {
    let log  = debug("bo:addMood");
    let data = req.body;
    log("[DA] add a mood", data);
    try {
        let result = await Master.addMood(data.mood);
        res.redirect("/master/mood");
    } catch (error) {
        next(error);
    }
};

exports.deleteMood = async (req, res, next) => {
    let log  = debug("bo:deleteMood");
    let data = req.body;
    log("[DA] delete a mood", data);
    try {
        let result = await Master.deleteMood(data.mood);
        res.redirect("/master/mood");
    } catch (error) {
        next(error);
    }
};

exports.promoCodePage = async (req, res, next) => {
    let log = debug("bo:promoCodePage");
    log("[DA] Render PromoCode Page");
    try {
        log("req.session", req.session);
        res.render("pages/master/promocode");
    } catch (error) {
        next(error);
    }
};

exports.getPromoCodeList = async (req, res, next) => {
    let log  = debug("bo:getPromoCodeList");
    let data = req.body;
    log("[DA] get all promocode", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "code";
        } else if (data.order[0].column == "2") {
            data.searchOrder = "start";
        } else if (data.order[0].column == "3") {
            data.searchOrder = "end";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await Master.getPromoCodeList(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.addPromoCode = async (req, res, next) => {
    let log  = debug("bo:addPromoCode");
    let data = req.body;
    log("[DA] add a promocode", data);
    try {
            data.code = toUpper(data.code);
        let result    = await Master.addPromoCode(data);
        res.redirect("/master/promocode");
    } catch (error) {
        next(error);
    }
};

exports.deletePromoCode = async (req, res, next) => {
    let log  = debug("bo:deletePromoCode");
    let data = req.body;
    log("[DA] delete a promocode", data);
    try {
        let result = await Master.deletePromoCode(data.code);
        res.redirect("/master/promocode");
    } catch (error) {
        next(error);
    }
};

exports.categoryPage = async (req, res, next) => {
    let log = debug("bo:categoryPage");
    log("[DA] Render Category Page");
    try {
        log("req.session", req.session);
        res.render("pages/master/category");
    } catch (error) {
        next(error);
    }
};

exports.getCategoryList = async (req, res, next) => {
    let log  = debug("bo:getCategoryList");
    let data = req.body;
    log("[DA] get all category", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "1") {
            data.searchOrder = "name";
        } else if (data.order[0].column == "3") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await Master.getCategoryList(data);
        log("result", result);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.addCategory = async (req, res, next) => {
    let log       = debug("bo:addCategory");
    let { files } = req;
    let { name }  = req.body;
    log("[DA] add a category", { files, name });
    try {
        let fileData = [];
        files.forEach(o => {
            fileData.push({
                value   : fs.createReadStream(o.path),
                options : {
                    filename    : o.originalname,
                    contentType : o.mimetype
                }
            });
        });
        let formData = {
            files : fileData,
            name  : name
        };
        let result = await Master.addCategory({ formData });
        log("result", result);
        res.redirect("/master/category");
    } catch (error) {
        next(error);
    }
};

exports.editCategory = async (req, res, next) => {
    let log                  = debug("bo:editCategory");
    let { files }            = req;
    let { categoryId, name } = req.body;
    log("[DA] edit a category", { files, categoryId, name });
    try {
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
            files      : fileData,
            categoryId : categoryId,
            name       : name
        };
        let result = await Master.editCategory({ formData });
        log("result", result);
        res.redirect("/master/category");
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    let log            = debug("bo:deleteCategory");
    let { categoryId } = req.body;
    log("[DA] delete a category", { categoryId });
    try {
        let result = await Master.deleteCategory({ categoryId });
        log("result", result);
        res.redirect("/master/category");
    } catch (error) {
        next(error);
    }
};

"use strict";

const debug      = require("debug");
const _          = require("lodash");
const { Parser } = require("json2csv");

const qElasticIndex = require("../queues/elasticindex");

let getAccessToken = async headers => {
    var log = debug("page:getAccessToken");
    let str = _.split(headers.authorization, " ");
    log("access token: Bearer ", str[1]);
    return { access_token: str[1] };
};

exports.userPage = async (req, res, next) => {
    let log = debug("bo:userPage");
    log("[DA] Render User Page");
    try {
        log("req.session", req.session);
        res.render("pages/user/index");
    } catch (error) {
        next(error);
    }
};

exports.userProfilePage = async (req, res, next) => {
    const log   = debug("bo:userProfilePage");
    const param = req.params;
    log("[DA] Render User Details Page", { param });
    try {
        let user = await req.queries("user").getUserData(param.userid);

        if (_.isEmpty(user.userDetail)) {
            let detail = await req.queries("user").addDetailUser({
                userId   : user._id,
                username : user.username
            });
            res.redirect(param.userid);
        } else {
            res.render("pages/user/profile", { user });

            // Elastic-search Indexing
            log("Queueing for Elasticsearch index...");
            let qEI = qElasticIndex();
            qEI.push({
                index : "user",
                type  : "user",
                id    : user.userDetail._id.toString(),
                body  : { userDetail: user.userDetail }
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.userEditMasterPage = async (req, res, next) => {
    const log   = debug("bo:userEditMasterPage");
    const param = req.params;
    log("[DA] Render User Edit Master Page", { param });
    try {
        let user = await req.queries("user").getUserData(param.userid);
        res.render("pages/user/profile", { user, masteredit: true });
    } catch (error) {
        next(error);
    }
};

exports.updateMasterUser = async (req, res, next) => {
    let log  = debug("bo:updateMasterUser");
    let data = req.body;
    log("[DA] update master user", data);
    try {
        let result = await req.queries("user").updateMasterUser(data);
        res.redirect("/user/profile/" + data.userId);
    } catch (error) {
        next(error);
    }
};

exports.userEditDetailPage = async (req, res, next) => {
    const log   = debug("bo:userEditDetailPage");
    const param = req.params;
    log("[DA] Render User Edit Detail Page", { param });
    try {
        let user       = await req.queries("user").getUserData(param.userid);
        let genderList = _.map(await req.queries("master").getAllGender(), "sex");
        res.render("pages/user/profile", {
            user,
            lists: {
                gender : genderList
            },
            detailedit : true
        });
    } catch (error) {
        next(error);
    }
};

exports.updateDetailUser = async (req, res, next) => {
    let log  = debug("bo:updateDetailUser");
    let data = req.body;
    log("[DA] update detail user", data);
    try {
        let result = await req.queries("user").updateDetailUser(data);
        res.redirect("/user/profile/" + data.userId);
    } catch (error) {
        next(error);
    }
};

exports.userDemographyByGenderPage = async (req, res, next) => {
    let log = debug("bo:userDemographyPage");
    log("[DA] Render User Demography Page");
    try {
        log("req.session", req.session);
        res.render("pages/demography/user-gender");
    } catch (error) {
        next(error);
    }
};

exports.userDemographyByLocationPostData = async (req, res, next) => {
    let log = debug("bo:demographyBylocPostData");
    log("[DA] Render Demography by Location Post Data");
    try {
        log("req.session", req.session);
        res.render("pages/demography/location-postdata");
    } catch (error) {
        next(error);
    }
};

exports.userDemographyByLocationStoryData = async (req, res, next) => {
    let log = debug("bo:demographyBylocStoryData");
    log("[DA] Render Demography by Location Story Data");
    try {
        log("req.session", req.session);
        res.render("pages/demography/location-storydata");
    } catch (error) {
        next(error);
    }
};

exports.userDemographyByLocationImageFile = async (req, res, next) => {
    let log = debug("bo:demographyByLocImgFile");
    log("[DA] Render Demography by Location Image File");
    try {
        log("req.session", req.session);
        res.render("pages/demography/location-imagefile");
    } catch (error) {
        next(error);
    }
};

exports.userDemographyByLocationLastActive = async (req, res, next) => {
    let log = debug("bo:demographyByLocLastActive");
    log("[DA] Render Demography by Location Last Active");
    try {
        log("req.session", req.session);
        res.render("pages/demography/location-lastactive");
    } catch (error) {
        next(error);
    }
};

exports.userDemographyByLocationIpAddress = async (req, res, next) => {
    let log = debug("bo:demographyByLocIpAddress");
    log("[DA] Render Demography by Location Ip Address");
    try {
        log("req.session", req.session);
        res.render("pages/demography/location-ipaddress");
    } catch (error) {
        next(error);
    }
};

exports.userDemographyByLocationPlaceId = async (req, res, next) => {
    let log = debug("bo:demographyBylocPlaceId");
    log("[DA] Render Demography by Location Place id");
    try {
        log("req.session", req.session);
        res.render("pages/demography/location-placeid");
    } catch (error) {
        next(error);
    }
};

exports.userSessionPage = async (req, res, next) => {
    let log = debug("bo:userSessionPage");
    log("[DA] Render User Session Page");
    try {
        let session = await req.queries("user").getSessionById(req.params.userid);
        res.render("pages/user/session", { session: session.data });
    } catch (error) {
        next(error);
    }
};

exports.userBanPage = async (req, res, next) => {
    let log = debug("bo:userBanPage");
    log("[DA] Render User Ban Page");
    try {
        log("req.session", req.session);
        res.render("pages/user/banlist");
    } catch (error) {
        next(error);
    }
};

exports.getAllUser = async (req, res, next) => {
    let log  = debug("bo:getAllUser");
    let data = req.body;
    log("[DA] get all users", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "2") {
            data.searchOrder = "username";
        } else if (data.order[0].column == "4") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await req.queries("user").getAllUserData(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.getAllBizDevUser = async (req, res, next) => {
    let log  = debug("bo:getAllBizDevUser");
    let data = req.body;
    log("[DA] get all bizdev users", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "2") {
            data.searchOrder = "username";
        } else if (data.order[0].column == "3") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let booster = await req.queries("booster").getAll();
        data.bizDevUser = _.map(booster, data => { return data.userId })

        let result = await req.queries("user").getAllBizDevUser(data);
        log("result", result)
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.getAllUserEnable = async (req, res, next) => {
    let log  = debug("bo:getAllUserEnable");
    let data = req.body;
    log("[DA] get all users enable/disable", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "2") {
            data.searchOrder = "username";
        } else if (data.order[0].column == "3") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await req.queries("user").getAllUserData(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.updateBanUser = async (req, res, next) => {
    let log  = debug("bo:updateBanUser");
    let data = req.body;
    log("[DA] update user details", data);
    try {
        let result = await req.queries("user").updateEnableUser(data);
        res.redirect("/user/ban");
    } catch (error) {
        next(error);
    }
};

exports.deleteSession = async (req, res, next) => {
    let log  = debug("bo:deleteSession");
    let data = req.body;
    log("[DA] delete user's session", data);
    try {
        let result = await req.queries("user").deleteSessionById(data.sessionId);
        res.redirect("back");
    } catch (error) {
        next(error);
    }
};

exports.deleteAllSession = async (req, res, next) => {
    let log  = debug("bo:deleteAllSession");
    let data = req.body;
    log("[DA] delete all user's session", data);
    try {
        let result = await req.queries("user").deleteSessionByUserId(data.userId);
        res.redirect("back");
    } catch (error) {
        next(error);
    }
};

exports.userReportPage = async (req, res, next) => {
    let log = debug("bo:userReportPage");
    log("[DA] Render User Report Page");
    try {
        log("req.session", req.session);
        res.render("pages/user/report");
    } catch (error) {
        next(error);
    }
};

exports.getUserReport = async (req, res, next) => {
    let log  = debug("bo:getUserReport");
    let data = req.body;
    log("[DA] get reported user", data);
    try {
        let search           = {};
        var regex            = "";
            data.searchOrder = "";

        if (data.order[0].column == "1") {
            data.searchOrder = "username";
        } else if (data.order[0].column == "3") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        if (!_.isEmpty(data.search.value)) {
            regex = new RegExp(data.search.value, "i");
            _.assign(search, {
                "object.username" : regex,
                type              : "USER"
            });
        } else {
            _.assign(search, { type: "USER" });
        }

        let options = {
            skip  : Number(data.start),
            limit : Number(data.length),
            sort  : data.searchOrder
        };

        let result = await req.queries("report").getUserReport(search, options);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.exportUser = async (req, res, next) => {
    let log  = debug("bo:exportUser");
    let data = req.body;
    log("[DA] export users", data);
    try {
        let options = {
            defaultValue : "none",
            fields       : [
				{
                    label : "User ID",
                    value : "_id"
				},
				{
                    label : "Email",
                    value : "local.email"
				},
				{
                    label : "Phone",
                    value : "mobile"
				},
                {
                    label : "Username",
                    value : "username"
				},
				{
                    label : "Firstname",
                    value : "userDetail.firstname"
				},
				{
                    label : "Lastname",
                    value : "userDetail.lastname"
				},
				{
                    label : "Sex",
                    value : "userDetail.sex"
				},
				{
                    label : "Birthday",
                    value : "userDetail.birthday"
				},
                {
                    label : "Referral Code",
                    value : "regSource.source"
                },
                {
                    label : "Register Date",
                    value : "createdAt"
                },
                {
                    label : "Last Login",
                    value : "sessions[1].updatedAt"
				},
				{
                    label : "Last Active",
                    value : "last_active.date"
                },
                {
                    label : "City",
                    value : "last_active.city"
                },
                {
                    label : "Country",
                    value : "last_active.country"
                }
            ]
        };
        var code  = _.toUpper(data.promocode);
        let check = await req.queries("master").checkPromoCode(code);
        log("check", check);
        var users   = await req.queries("user").getAllUsers();
        var csvData = [];
        if (check[0].exists == true) {
            users.forEach(o => {
                if (o.regSource) if (o.regSource.source == code) csvData.push(o);
            });
        } else {
            csvData = users;
        }
        let json2csvParser = new Parser(options);
        let result         = json2csvParser.parse(csvData);
        let path           = "uploads/[DA]Users-" + new Date(Date.now()) + ".csv";
        await fs.writeFileSync(path, result);
        res.download(path);
    } catch (error) {
        next(error);
    }
};

exports.exportUserDemography = async (req, res, next) => {
    let log  = debug("bo:exportUserDemography");
    let data = req.body;
    log("[DA] export users demography", data);
    try {
        let options = {
            defaultValue : "none",
            fields       : [
				{
                    label : "ID",
                    value : "_id"
				},
				{
                    label : "Teens Age",
                    value : "age.teens"
                },
                {
                    label : "Adults Age",
                    value : "age.adults"
                },
                {
                    label : "Middle Age",
                    value : "age.middle"
                },
                {
                    label : "Senior Age",
                    value : "age.senior"
                },
                {
                    label : "Others Age",
                    value : "age.others"
                },
                {
                    label : "Total User",
                    value : "dataCount"
				},
                {
                    label : "Updated Date",
                    value : "updatedAt"
                }
            ]
        };
        var code  = _.toUpper(data.promocode);
        let check = await req.queries("master").checkPromoCode(code);
        log("check", check);
        var users   = await req.queries("user").getDemography();
        var csvData = [];
        if (check[0].exists == true) {
            users.forEach(o => {
                if (o.regSource) if (o.regSource.source == code) csvData.push(o);
            });
        } else {
            csvData = users;
        }
        let json2csvParser = new Parser(options);
        let result         = json2csvParser.parse(csvData);
        let path           = "uploads/[DA]Users-" + new Date(Date.now()) + ".csv";
        await fs.writeFileSync(path, result);
        res.download(path);
    } catch (error) {
        next(error);
    }
};
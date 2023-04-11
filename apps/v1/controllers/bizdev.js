"use strict";

const debug = require("debug");
const {
    assign, //
    isEmpty,
    map,
    toString
} = require("lodash");
const fs = require("fs");

exports.bizDevAccountPage = async (req, res, next) => {
    let log = debug("bo:bizDevAccountPage");
    log("[DA] Render BizDev Account Page");
    try {
        let indicatorList = map(await req.queries("master").getAllIndicator(), "indicator");
        let moodList      = map(await req.queries("master").getAllMood(), "mood");
        res.render("pages/bizdev/index", {
            lists: {
                indicator : indicatorList,
                mood      : moodList
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.bizDevRegister = async (req, res, next) => {
    let log  = debug("bo:bizDevRegister");
    let data = req.body;
    log("[DA] Register Account for BizDev", data);
    try {
        let register = await req.queries("user").register(data);
        log("register", register);
        res.redirect("/bizdev/account");
    } catch (error) {
        next(error);
    }
};

exports.bizDevLogin = async (req, res, next) => {
    let log  = debug("bo:bizDevLogin");
    let data = req.body;
    log("[DA] Login Account for BizDev", data);
    try {
        let login = await req.queries("user").login(data);
        log("login", login);
    } catch (error) {
        next(error);
    }
};

exports.bizDevLoginOTP = async (req, res, next) => {
    let log  = debug("bo:bizDevLoginOTP");
    let data = req.body;
    log("[DA] Login OTP Account for BizDev", data);
    try {
        let loginOTP = await req.queries("user").loginOTP(data);
        log("loginOTP", loginOTP);

        if (!isEmpty(loginOTP._id)) {
            let indicatorList = map(await req.queries("master").getAllIndicator(), "indicator");
            let moodList      = map(await req.queries("master").getAllMood(), "mood");

            // BIND ACCOUNT
            let check = await req.queries("booster").check(toString(loginOTP._id));
            if (isEmpty(check)) {
                let booster = await req.queries("booster").create(toString(loginOTP._id), toString(loginOTP.session.access_token));
                log("booster", booster);
            } else {
                let booster = await req.queries("booster").update(toString(loginOTP._id), toString(loginOTP.session.access_token));
                log("booster", booster);
            }
            res.render("pages/bizdev/index", {
                userData : loginOTP,
                lists    : {
                    indicator : indicatorList,
                    mood      : moodList
                }
            });
        } else {
            res.render("pages/bizdev/index", {
                OTPAlert : true
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.bizDevPost = async (req, res, next) => {
    let log   = debug("bo:bizDevPost");
    let files = req.files;
    let data  = req.body;
    log("[DA] BizDev Account Upload Post", { files, data });
    try {
        var fileData = [];
        files.forEach(data => {
            fileData.push({
                value   : fs.createReadStream(data.path),
                options : {
                    filename    : data.originalname,
                    contentType : data.mimetype
                }
            });
        });
        let formData = {
            files           : fileData,
            name            : data.name,
            caption         : data.caption,
            indicator       : data.indicator,
            mood            : data.mood,
            longitude       : data.longitude,
            latitude        : data.latitude,
            postType        : data.postType,
            disableComments : data.disableComments
        };

        let check = await req.queries("booster").check(data.userId);

        let upload = await req.queries("post").uploadPost({
            datoken      : data.datoken,
            access_token : check.access_token,
            form         : formData
        });
        if (isEmpty(upload.data)) {
            res.redirect("/bizdev/account");
        }
    } catch (error) {
        next(error);
    }
};

exports.bizDevLogout = async (req, res, next) => {
    let log  = debug("bo:bizDevLogout");
    let data = req.body;
    log("[DA] Logout Account for BizDev", data);
    try {
        //UNBIND ACCOUNT
        let check = await req.queries("booster").check(data.userId);
        if (!isEmpty(check)) {
            let booster = await req.queries("booster").remove(data.userId);
            log("booster", booster);
        }

        let logout = await req.queries("user").logout(data);
        log("logout", logout);
        res.redirect("/bizdev/account");
    } catch (error) {
        next(error);
    }
};

exports.statisticCount = async (req, res, next) => {
    let log = debug("bo:statisticCount");
    log("[DA] statistic count");
    try {
        let result = assign(
            (await req.queries("user").getStatistic()),
            (await req.queries("tenfavs").getStatistic()),
            (await req.queries("story").getStatistic()),
            (await req.queries("post").getStatistic())
        );
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.demography = async (req, res, next) => {
    let log = debug("bo:demography");
    log("[DA] demography count");
    try {
        let result = await req.queries("user").getDemography()
        log('results', result)
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.demographyByPostData = async (req, res, next) => {
    let log = debug("bo:demographyByPost");
    log("[DA] demography by post data");
    try {
        let result = await req.queries("post").getLocationByPost();
        log('results', result);
        res.send(result);
    } catch (error) {
        next(error);
    }   
};

exports.demographyByStoryData = async (req, res, next) => {
    let log = debug("bo:demographyByStory");
    log("[DA] demography by story data");
    try {
        let result = await req.queries("story").getLocationByStory();
        log('results', result);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.demographyByLastActive = async (req, res, next) => {
    let log = debug("bo:demographyByLastActive");
    log("[DA] demography by last active");
    try {
        let result = await req.queries("user").getLocationByLastActive();
        log('results', result);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.demographyByPostImageFile = async (req, res, next) => {
    let log = debug("bo:demographyByPostImageFile");
    log("[DA] demography by post image file");
    try {
        let result = await req.queries("post").getLocationByPostImageFile();
        log('result', result);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

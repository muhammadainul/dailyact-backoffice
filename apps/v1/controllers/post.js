"use strict";

const debug      = require("debug");
const _          = require("lodash");
const { Parser } = require("json2csv");

let getAccessToken = async headers => {
    var log = debug("page:getAccessToken");
    let str = _.split(headers.authorization, " ");
    log("access token: Bearer ", str[1]);
    return { access_token: str[1] };
};

exports.postPage = async (req, res, next) => {
    let log = debug("bo:postPage");
    log("[DA] Render Post Page");
    try {
        log("req.session", req.session);
        res.render("pages/post/index");
    } catch (error) {
        next(error);
    }
};

exports.getAllPost = async (req, res, next) => {
    let log  = debug("bo:getAllPost");
    let data = req.body;
    log("[DA] get all posts", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "3") {
            data.searchOrder = "likesCount";
        } else if (data.order[0].column == "4") {
            data.searchOrder = "createdAt";
        }

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await req.queries("post").getAllPostData(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.addThumbnailImages = async (req, res, next) => {
    let log = debug("bo:addThumbnailImages");
    log("[DA] add missing thumbnail images");
    try {
        let resultPost  = await req.queries("post").addThumbnailPost();
        let resultStory = await req.queries("story").addThumbnailStory();
        log("result", {
            post  : resultPost,
            story : resultStory
        });
        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

exports.exportPost = async (req, res, next) => {
    let log  = debug("bo:exportPost");
    let data = req.body;
    log("[DA] export posts", data);
    try {
        let options = {
            defaultValue : "none",
            fields       : [
				{
                    label : "Post Id",
                    value : "_id"
                },
                {
                    label : "Username",
                    value : "userId.username"
                },
                {
                    label : "Caption",
                    value : "caption.value"
                },
                {
                    label : "Likes Count",
                    value : "likesCount"
                },
                {
                    label : "Post Date",
                    value : "createdAt"
                }
            ]
        };
		let csvData        = await req.queries("post").getPostExport(data);
        let json2csvParser = new Parser(options);
		let result         = json2csvParser.parse(csvData);
        let path           = "uploads/[DA]Post-" + new Date(Date.now()) + ".csv";
        await fs.writeFileSync(path, result);
        res.download(path);
    } catch (error) {
        next(error);
    }
};

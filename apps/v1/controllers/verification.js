'use strict'

const debug = require('debug')
const axios = require('axios').default

const User = require("../queries/user")
const decryptFile = require("../libs/decrypt")

const {
    isEmpty,
} = require("lodash");

let getAccessToken = async headers => {
    var log = debug("page:getAccessToken");
    let str = _.split(headers.authorization, " ");
    log("access token: Bearer ", str[1]);
    return { access_token: str[1] };
};

exports.verifPage = async (req, res, next) => {
    let log = debug("bo:verifPage")
    log("[DA] Render Verification Page");
    try {
        log("req.session", req.session);
        res.render("pages/verification/index");
    } catch (error) {
        next(error);
    }
};

exports.getAllVerification = async (req, res, next) => {
    let log  = debug("bo:getAllVerification");
    let data = req.body;
    log("[DA] get all verification", data);
    try {
        data.searchOrder = "";
        if (data.order[0].column == "6") {
            data.searchOrder = "createdAt";
        } 

        if (data.order[0].dir == "desc") {
            data.searchOrder = "-" + data.searchOrder;
        }

        let result = await req.queries("user").getAllVerifData(data);
        res.send(result).data;
    } catch (error) {
        next(error);
    }
};

exports.verificationReview = async (req, res, next) => {
    let log = debug('bo:verificationReviewPage')
    let param = req.params
    log('[DA] Render Verification Review Page', { param })
    try {
        let verification = await User.getVerificationData({ verificationId: param.verificationid })
        let image = verification.id_card
        if (isEmpty(image)) {
            return res.render('pages/verification/review', { verification })
        } else {
            let response = await axios.get(verification.id_card.original.filename, { responseType: 'arraybuffer' })
            log("response", response.data)
            verification.id_card = decryptFile(response.data).toString('base64')
            res.render('pages/verification/review', { verification })
        }
    } catch (error) {
        next(error)
    }
};

exports.verificationUpdate = async (req, res, next) => {
    let log  = debug("bo:updateConfirmVerif");
    let user = req.user
    log("[DA] update verification ", { body: req.body });
    let { verificationId, approved, reason } = req.body
    try {
        if (req.body.verificationId && req.body.reason) {
            let result = await req.queries("user").updateConfirmVerif({
                verificationId,
                approved : false,
                reason
            });
            // res.redirect("pages/verification/list" + verificationId)
        } else {
            let result = await req.queries("user").updateConfirmVerif({ 
                verificationId,
                approved : true,
                reason : ''
            });
            // res.redirect("pages/verification/list" + verificationId)
        }
    } catch (error) {
        next(error);
    }
};
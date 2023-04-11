'use strict'

const debug = require('debug')
const _ = require('lodash')

const Community = require('../queries/community')

let getAccessToken = async headers => {
    var log = debug('page:getAccessToken')
    let str = _.split(headers.authorization, ' ')
    log('access token: Bearer ', str[1])
    return { access_token: str[1] }
}

// REPORT
exports.reportPost = async (req, res, next) => {
    let log = debug('bo:reportPost')
    let data = req.body
    log('[DA] report a post', data)
    try {
        let check = await req.queries('report').check({
            userId: data.userId,
            'object._id': data.postId
        })
        if (check) return res.error("Can't report same post twice.")

        let { access_token } = await getAccessToken(req.headers)
        let checkReport = await req.queries('master').checkReport(data.reason)
        log('checkReport', checkReport)
        if (checkReport) {
            res.success({ message: 'Thank you for reporting this.' })
            let postObj = await req.queries('post').getPostData(data.postId, access_token)
            // let visionObj = await Promise.all(
            //     _.map(postObj.files, file => {
            //         var str = file.filename.split(".");
            //         if (str[1] == "jpeg" || str[1] == "jpg") {
            //             var find = _.find(file.s3, o => {
            //                 return o.type == "quality";
            //             });
            //             var vision                     = req.queries("imageprocess").visionCheck(find.filename);
            //             if  (_.isEmpty(vision)) vision = { fileId: file._id };
            //             return vision;
            //         } else return { isVideo: true };
            //     })
            // );
            // log("visionObj", visionObj);
            let report = {
                userId: data.userId,
                type: 'POST',
                object: postObj,
                reason: data.reason
                // ,vision : visionObj
            }
            let result = await req.queries('report').add(report)
            log('result', result)

            // TODO: Sent email notification to related officer
        } else {
            res.error("reason doesn't exist")
        }
    } catch (error) {
        next(error)
    }
}

exports.reportStory = async (req, res, next) => {
    let log = debug('bo:reportStory')
    let data = req.body
    log('[DA] report a story', data)
    try {
        let check = await req.queries('report').check({
            userId: data.userId,
            'object._id': data.storyId
        })
        if (check) return res.error("Can't report same story twice.")

        let { access_token } = await getAccessToken(req.headers)
        let checkReport = await req.queries('master').checkReport(data.reason)
        log('checkReport', checkReport)
        if (checkReport) {
            let storyObj = await req.queries('story').getStoryData(data.storyId, access_token)
            let report = {
                userId: data.userId,
                type: 'STORY',
                object: storyObj,
                reason: data.reason
            }
            let result = await req.queries('report').add(report)
            log('result', result)
            res.success(result)
        } else {
            res.error("reason doesn't exist")
        }
    } catch (error) {
        next(error)
    }
}

exports.reportUser = async (req, res, next) => {
    let log = debug('bo:reportUser')
    let data = req.body
    log('[DA] report a user', data)
    try {
        let check = await req.queries('report').check({
            userId: data.userId,
            'object._id': data.reportUserId
        })
        if (check) return res.error("Can't report same user twice.")

        let { access_token } = await getAccessToken(req.headers)
        let checkReport = await req.queries('master').checkReport(data.reason)
        log('checkReport', checkReport)
        if (checkReport) {
            let userObj = await req.queries('user').getUserData(data.reportUserId, access_token)
            let report = {
                userId: data.userId,
                type: 'USER',
                object: userObj,
                reason: data.reason
            }
            let result = await req.queries('report').add(report)
            log('result', result)
            res.success(result)
        } else {
            res.error("reason doesn't exist")
        }
    } catch (error) {
        next(error)
    }
}

exports.reportComment = async (req, res, next) => {
    let log = debug('bo:reportComment')
    let data = req.body
    log('[DA] report a comment', data)
    try {
        let check = await req.queries('report').check({
            userId: data.userId,
            'object._id': data.commentId
        })
        if (check) return res.error("Can't report same comment twice.")

        let { access_token } = await getAccessToken(req.headers)
        let checkReport = await req.queries('master').checkReport(data.reason)
        log('checkReport', checkReport)
        if (checkReport) {
            let commentObj = await req.queries('post').getCommentData(data.commentId, access_token)
            let report = {
                userId: data.userId,
                type: 'COMMENT',
                object: commentObj,
                reason: data.reason
            }
            let result = await req.queries('report').add(report)
            log('result', result)
            res.success(result)
        } else {
            res.error("reason doesn't exist")
        }
    } catch (error) {
        next(error)
    }
}

exports.reportCommunity = async (req, res, next) => {
    let log = debug('bo:reportCommunity')
    let { communityId, userId, reason } = req.body
    let { access_token } = await getAccessToken(req.headers)
    log('[DA] report a community', { communityId, userId, reason })
    try {
        let check = await req.queries('report').check({
            userId: userId,
            'object._id': communityId
        })
        if (check) return res.error("Can't report same community twice.")

        let checkReport = await req.queries('master').checkReport(reason)
        if (!checkReport) return res.error("Reason doesn't exist")

        let communityObj = await Community.getCommunityData({ access_token, communityId })
        if (_.isEmpty(communityObj)) return res.error('Community not found.')
        let report = {
            userId: userId,
            type: 'COMMUNITY',
            object: communityObj,
            reason: reason
        }
        let result = await req.queries('report').add(report)
        log('result', result)
        res.success(result)
    } catch (error) {
        next(error)
    }
}

// BACK OFFICE

exports.userReportPage = async (req, res, next) => {
    let log = debug('bo:userReportPage')
    log('[DA] Render User Report Page')
    try {
        log('req.session', req.session)
        res.render('pages/user/report')
    } catch (error) {
        next(error)
    }
}

exports.getUserReport = async (req, res, next) => {
    let log = debug('bo:getUserReport')
    let data = req.body
    log('[DA] get reported user', data)
    try {
        let search = {}
        var regex = ''
        data.searchOrder = ''

        if (data.order[0].column == '1') {
            data.searchOrder = 'object.username'
        } else if (data.order[0].column == '3') {
            data.searchOrder = 'createdAt'
        }

        if (data.order[0].dir == 'desc') {
            data.searchOrder = '-' + data.searchOrder
        }

        if (!_.isEmpty(data.search.value)) {
            regex = new RegExp(data.search.value, 'i')
            _.assign(search, {
                'object.username': regex,
                type: 'USER'
            })
        } else {
            _.assign(search, { type: 'USER' })
        }

        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder
        }

        let result = await req.queries('report').getReport(search, options)
        res.send(result).data
    } catch (error) {
        next(error)
    }
}

exports.postReportPage = async (req, res, next) => {
    let log = debug('bo:postReportPage')
    log('[DA] Render Post Report Page')
    try {
        log('req.session', req.session)
        res.render('pages/post/report')
    } catch (error) {
        next(error)
    }
}

exports.getPostReport = async (req, res, next) => {
    let log = debug('bo:getPostReport')
    let data = req.body
    log('[DA] get reported post', data)
    try {
        let search = {}
        var regex = ''
        data.searchOrder = ''

        if (data.order[0].column == '3') {
            data.searchOrder = 'createdAt'
        }

        if (data.order[0].dir == 'desc') {
            data.searchOrder = '-' + data.searchOrder
        }

        if (!_.isEmpty(data.search.value)) {
            regex = new RegExp(data.search.value, 'i')
            _.assign(search, {
                'object.caption.value': regex,
                type: 'POST'
            })
        } else {
            _.assign(search, { type: 'POST' })
        }

        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder
        }

        let result = await req.queries('report').getReport(search, options)
        res.send(result).data
    } catch (error) {
        next(error)
    }
}

exports.commentReportPage = async (req, res, next) => {
    let log = debug('bo:commentReportPage')
    log('[DA] Render Comment Report Page')
    try {
        log('req.session', req.session)
        res.render('pages/post/report_comment')
    } catch (error) {
        next(error)
    }
}

exports.getCommentReport = async (req, res, next) => {
    let log = debug('bo:getCommentReport')
    let data = req.body
    log('[DA] get reported comment', data)
    try {
        let search = {}
        var regex = ''
        data.searchOrder = ''

        if (data.order[0].column == '3') {
            data.searchOrder = 'createdAt'
        }

        if (data.order[0].dir == 'desc') {
            data.searchOrder = '-' + data.searchOrder
        }

        if (!_.isEmpty(data.search.value)) {
            regex = new RegExp(data.search.value, 'i')
            _.assign(search, {
                'object.caption.value': regex,
                type: 'COMMENT'
            })
        } else {
            _.assign(search, { type: 'COMMENT' })
        }

        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder
        }

        let result = await req.queries('report').getReport(search, options)
        res.send(result).data
    } catch (error) {
        next(error)
    }
}

exports.storyReportPage = async (req, res, next) => {
    let log = debug('bo:storyReportPage')
    log('[DA] Render Story Report Page')
    try {
        log('req.session', req.session)
        res.render('pages/story/report')
    } catch (error) {
        next(error)
    }
}

exports.getStoryReport = async (req, res, next) => {
    let log = debug('bo:getStoryReport')
    let data = req.body
    log('[DA] get reported story', data)
    try {
        let search = {}
        var regex = ''
        data.searchOrder = ''

        if (data.order[0].column == '3') {
            data.searchOrder = 'createdAt'
        }

        if (data.order[0].dir == 'desc') {
            data.searchOrder = '-' + data.searchOrder
        }

        // if (!_.isEmpty(data.search.value)) {
        //     regex = new RegExp(data.search.value, "i");
        //     _.assign(search, {
        //         "object.caption.value": regex,
        //         type: "STORY"
        //     });
        // } else {
        _.assign(search, { type: 'STORY' })
        // }

        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder
        }

        let result = await req.queries('report').getReport(search, options)
        res.send(result).data
    } catch (error) {
        next(error)
    }
}

exports.communityReportPage = async (req, res, next) => {
    let log = debug('bo:communityReportPage')
    log('[DA] Render Community Report Page')
    try {
        log('req.session', req.session)
        res.render('pages/community/report')
    } catch (error) {
        next(error)
    }
}

exports.getCommunityReport = async (req, res, next) => {
    let log = debug('bo:getCommunityReport')
    let data = req.body
    log('[DA] get reported community', data)
    try {
        let search = {}
        var regex = ''
        data.searchOrder = ''

        if (data.order[0].column == '4') {
            data.searchOrder = 'createdAt'
        }

        if (data.order[0].dir == 'desc') {
            data.searchOrder = '-' + data.searchOrder
        }

        if (!_.isEmpty(data.search.value)) {
            regex = new RegExp(data.search.value, 'i')
            _.assign(search, {
                'object.name': regex,
                type: 'COMMUNITY'
            })
        } else {
            _.assign(search, { type: 'COMMUNITY' })
        }

        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder
        }

        let result = await req.queries('report').getReport(search, options)
        res.send(result).data
    } catch (error) {
        next(error)
    }
}
'use strict'

const jwt = require('jsonwebtoken')
const debug = require('debug')
const _ = require('lodash')
const service = require('../config/service')
const { post } = require('../libs/request')

let isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}

let isSelf = (req, res, next) => {
    // is self
    let log = debug('route:isSelf')
    log('headers', {
        params: req.params.userid,
        user: req.user
    })
    if (req.params.userid != _.toString(req.user._id)) return res.redirect('/admin/profile/' + req.params.userid)
    return next()
}

let getAccessTokenFromHeader = async headers => {
    let log = debug('route:getAccessTokenFromHeader')
    log('headers', headers)
    let str = _.split(headers.authorization, ' ')
    log('access token: Bearer ', str[1])
    return str[1]
}

let verifyJWT = async (req, res, next) => {
    try {
        let decoded = jwt.verify(await getAccessTokenFromHeader(req.headers), myConfig.session_secret)
        console.log(decoded)
        req.user = decoded
        next()
    } catch (error) {
        return res.render('page/login', { error: 'Unauthorized access. Please login' })
    }
}

let verifyPayload = async (req, res, next) => {
    try {
        let { id, username, admin } = req.user

        let user = await req.queries('user').getByIdUsernameAndAdmin(id, username, admin)
        if (!user) return res.error('Unauthorized access. Admin only', 570, res.error_lib.UNAUTHORIZED)
        next()
    } catch (error) {
        return res.error('Unauthorized access. Admin only', 570, res.error_lib.UNAUTHORIZED)
    }
}

let isVerifiedUser = async (req, res, next) => {
    let log = debug('route:isVerified')
    try {
        let url = service.user + 'verify/jwtpayload'
        let header = { Authorization: req.headers.authorization }
        let body = req.user
        log('url, header, body', { url, header, body })
        let response = await post(url, header, body)
        if (response.data.exists == false || !_.isEmpty(response.error)) return res.error(response.error.message, 570)
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = (app, router) => {
    const bizdev = app.controller('bizdev')
    const business = app.controller('business')
    const gateway = app.controller('gateway')
    const index = app.controller('index')
    const master = app.controller('master')
    const post = app.controller('post')
    const story = app.controller('story')
    const community = app.controller('community')
    const report = app.controller('report')
    const tenfavs = app.controller('tenfavs')
    const user = app.controller('user')
    const verification = app.controller('verification')
    const web = app.controller('web')
    const validate = app.controller('validation')
    const sanitize = app.controller('sanitization')

    router.get('/ping', index.ping)

    // INDEX
    router.get('/', isAuthenticated, index.indexPage)

    // REGISTER
    router.get('/register', isAuthenticated, index.registerPage)
    router.post('/register', [validate.register], isAuthenticated, index.register)

    // LOGIN & LOGOUT
    router.get('/login', index.loginPage)
    router.post('/login', [validate.login, sanitize.login], index.passportLogin)
    router.get('/logout', index.logout)

    // ADMIN
    router.get(['/admin', '/admin/list'], isAuthenticated, index.adminPage)
    router.get('/admin/profile/:userid', isAuthenticated, index.adminProfilePage)
    // ADMIN-USER
    router.get('/admin/user/:userid/edit', isAuthenticated, isSelf, index.adminUserEditPage)
    router.post('/admin/user/update', [validate.adminUserUpdate], isAuthenticated, index.adminUserUpdate)
    // DETAIL
    router.get('/admin/userdetail/:userid/edit', isAuthenticated, index.adminUserDetailEditPage)
    router.post('/admin/userdetail/update', [validate.adminUserDetailUpdate], isAuthenticated, index.adminUserDetailUpdate)
    // ROLES & PRIVILEGES
    router.get('/admin/roles', isAuthenticated, index.adminRolesPage)
    router.post('/admin/roles/add', isAuthenticated, index.adminRolesAdd)
    router.get('/admin/roles/:roleid/edit', isAuthenticated, index.adminRolesEditPage)
    router.post('/admin/roles/update', isAuthenticated, index.adminRolesUpdate)

    router.post('/admin/privileges/add', isAuthenticated, index.adminPrivilegeAdd)
    router.get('/admin/privilege/:privilegeid/edit', isAuthenticated, index.adminPrivilegeEditPage)
    router.post('/admin/privilege/update', isAuthenticated, index.adminPrivilegeUpdate)

    // GATEWAY
    router.post('/token/get', isAuthenticated, gateway.getToken)
    router.get('/gateway/version/list', isAuthenticated, gateway.versionPage)
    router.post('/gateway/version/getAll', isAuthenticated, gateway.getAllVersion)
    router.post('/gateway/version/add', isAuthenticated, gateway.versionAdd)
    router.post('/gateway/version/delete', isAuthenticated, gateway.versionDelete)
    router.get('/gateway/referral/list', isAuthenticated, gateway.referralPage)
    router.post('/gateway/referral/getAll', isAuthenticated, gateway.getAllReferral)

    // USER
    router.get('/user/list', isAuthenticated, user.userPage)
    router.post('/user/getAllUser', isAuthenticated, user.getAllUser)
    router.post('/user/getAllBizDevUser', isAuthenticated, user.getAllBizDevUser)
    router.post('/user/export', isAuthenticated, user.exportUser)
    router.post('/user/exportUserDemography', isAuthenticated, user.exportUserDemography)
    router.get('/user/demography_gender', isAuthenticated, user.userDemographyByGenderPage)
    router.get('/user/demography_location-postdata', isAuthenticated, user.userDemographyByLocationPostData)
    router.get('/user/demography_location-storydata', isAuthenticated, user.userDemographyByLocationStoryData)
    router.get('/user/demography_location-imagefile', isAuthenticated, user.userDemographyByLocationImageFile)
    router.get('/user/demography_location-lastactive', isAuthenticated, user.userDemographyByLocationLastActive)
    router.get('/user/demography_location-ipaddress', isAuthenticated, user.userDemographyByLocationIpAddress)
    router.get('/user/demography_location-placeid', isAuthenticated, user.userDemographyByLocationPlaceId)
    router.get('/user/profile/:userid', isAuthenticated, user.userProfilePage)
    router.get('/user/profile/:userid/edit/master', isAuthenticated, user.userEditMasterPage)
    router.get('/user/profile/:userid/edit/detail', isAuthenticated, user.userEditDetailPage)
    router.post('/user/master/update', isAuthenticated, user.updateMasterUser)
    router.post('/user/detail/update', isAuthenticated, user.updateDetailUser)

    router.get('/user/session/:userid', isAuthenticated, user.userSessionPage)
    router.post('/user/session/delete', isAuthenticated, user.deleteSession)
    router.post('/user/session/deleteall', isAuthenticated, user.deleteAllSession)

    router.get('/user/ban', isAuthenticated, user.userBanPage)
    router.post('/user/getAllUserEnable', isAuthenticated, user.getAllUserEnable)
    router.post('/user/update/ban', isAuthenticated, user.updateBanUser)

    // VERIFICATION
    router.get('/verification/list', isAuthenticated, verification.verifPage)
    router.post('/verification/getAllVerification', isAuthenticated, verification.getAllVerification)
    router.get('/verification/review/:verificationid', isAuthenticated, verification.verificationReview)
    router.post('/verification/review/update', isAuthenticated, verification.verificationUpdate)

    // POST
    router.get('/post/list', isAuthenticated, post.postPage)
    router.post('/post/getAllPost', isAuthenticated, post.getAllPost)
    router.post('/post/export', isAuthenticated, post.exportPost)
    router.post('/post/thumbnail/add', isAuthenticated, post.addThumbnailImages)

    // STORY
    router.get('/story/list', isAuthenticated, story.storyPage)
    router.get('/story/detail/:storyid', isAuthenticated, story.storyDetailPage)
    router.post('/story/getAllStory', isAuthenticated, story.getAllStory)

    // COMMUNITY
    router.get('/community/list', isAuthenticated, community.communityPage)
    router.get('/community/detail/:communityid', isAuthenticated, community.communityDetailPage)
    router.post('/community/getAllCommunity', isAuthenticated, community.getAllCommunity)

    // TENFAVS
    router.get('/tenfavs/export', isAuthenticated, tenfavs.exportTenFavs)
    router.get('/tenfavs/list', isAuthenticated, tenfavs.tenfavsPage)
    router.post('/tenfavs/list', isAuthenticated, tenfavs.getTenFavsList)
    router.post('/tenfavs/edit', isAuthenticated, tenfavs.editTenFavs)

    // WEB
    router.get('/web/subscribe', isAuthenticated, web.subscribePage)
    router.get('/web/contact', isAuthenticated, web.contactPage)
    router.post('/web/getSubscribe', isAuthenticated, web.getSubscribe)
    router.post('/web/getContact', isAuthenticated, web.getContact)

    // REPORT
    router.post('/report/post', [verifyJWT, isVerifiedUser], report.reportPost)
    router.post('/report/story', [verifyJWT, isVerifiedUser], report.reportStory)
    router.post('/report/user', [verifyJWT, isVerifiedUser], report.reportUser)
    router.post('/report/comment', [verifyJWT, isVerifiedUser], report.reportComment)
    router.post('/report/community', [verifyJWT, isVerifiedUser], report.reportCommunity)

    router.get('/user/report', isAuthenticated, report.userReportPage)
    router.post('/user/report/get', isAuthenticated, report.getUserReport)
    router.get('/post/report', isAuthenticated, report.postReportPage)
    router.post('/post/report/get', isAuthenticated, report.getPostReport)
    router.get('/post/report_comment', isAuthenticated, report.commentReportPage)
    router.post('/post/report/get_comment', isAuthenticated, report.getCommentReport)
    router.get('/story/report', isAuthenticated, report.storyReportPage)
    router.post('/story/report/get', isAuthenticated, report.getStoryReport)
    router.get('/community/report', isAuthenticated, report.communityReportPage)
    router.post('/community/report/get', isAuthenticated, report.getCommunityReport)

    // BIZDEV
    router.post('/bizdev/statistic', bizdev.statisticCount)
    router.post('/bizdev/demography', bizdev.demography)
    router.post('/bizdev/demographyByPostData', bizdev.demographyByPostData)
    router.post('/bizdev/demographyByStoryData', bizdev.demographyByStoryData)
    router.post('/bizdev/demographyByLastActive', bizdev.demographyByLastActive)
    router.post('/bizdev/demographyByPostImageFile', bizdev.demographyByPostImageFile)
    router.get('/bizdev/account', isAuthenticated, bizdev.bizDevAccountPage)
    router.post('/bizdev/register', isAuthenticated, bizdev.bizDevRegister)
    router.post('/bizdev/login', isAuthenticated, bizdev.bizDevLogin)
    router.post('/bizdev/account', isAuthenticated, bizdev.bizDevLoginOTP)
    router.post('/bizdev/post', isAuthenticated, bizdev.bizDevPost)
    router.post('/bizdev/logout', isAuthenticated, bizdev.bizDevLogout)

    // BUSINESS
    router.post('/business/checkin/guest', business.checkinGuest)

    // MASTER
    router.get('/master/gender', isAuthenticated, master.genderPage)
    router.post('/master/gender/list', isAuthenticated, master.getGenderList)
    router.post('/master/gender/add', isAuthenticated, master.addGender)
    router.post('/master/gender/delete', isAuthenticated, master.deleteGender)

    router.get('/master/report', isAuthenticated, master.reportPage)
    router.post('/master/report/list', isAuthenticated, master.getReportList)
    router.post('/master/report/add', isAuthenticated, master.addReport)
    router.post('/master/report/delete', isAuthenticated, master.deleteReport)

    router.get('/master/posttype', isAuthenticated, master.postTypePage)
    router.post('/master/posttype/list', isAuthenticated, master.getPostTypeList)
    router.post('/master/posttype/add', isAuthenticated, master.addPostType)
    router.post('/master/posttype/delete', isAuthenticated, master.deletePostType)

    router.get('/master/indicator', isAuthenticated, master.indicatorPage)
    router.post('/master/indicator/list', isAuthenticated, master.getIndicatorList)
    router.post('/master/indicator/add', isAuthenticated, master.addIndicator)
    router.post('/master/indicator/delete', isAuthenticated, master.deleteIndicator)

    router.get('/master/mood', isAuthenticated, master.moodPage)
    router.post('/master/mood/list', isAuthenticated, master.getMoodList)
    router.post('/master/mood/add', isAuthenticated, master.addMood)
    router.post('/master/mood/delete', isAuthenticated, master.deleteMood)

    router.get('/master/promocode', isAuthenticated, master.promoCodePage)
    router.post('/master/promocode/list', isAuthenticated, master.getPromoCodeList)
    router.post('/master/promocode/add', isAuthenticated, master.addPromoCode)
    router.post('/master/promocode/delete', isAuthenticated, master.deletePromoCode)

    router.get('/master/category', isAuthenticated, master.categoryPage)
    router.post('/master/category/list', isAuthenticated, master.getCategoryList)
    router.post('/master/category/add', isAuthenticated, master.addCategory)
    router.post('/master/category/edit', isAuthenticated, master.editCategory)
    router.post('/master/category/delete', isAuthenticated, master.deleteCategory)
}

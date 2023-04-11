'use strict'

let nocache = require('nocache')
let xss = require('xss')
let multer = require('multer')
let os = require('os')
let pug = require('pug')
var uaparse = require('user-agent-parser')
let passport = require('passport')
let { includes } = require('lodash')

// let multiparty = require('multiparty')
// var multipart = require('connect-multiparty')

let CleanXSS = param => {
    let myxss = new xss.FilterXSS({
        stripIgnoreTag: true
    })
    return myxss.process(unescape(param))
}

// function CleanSQLInjection(param)
// {
//     return param
// }

//[William]: plan to make a function to sanitize the data
let SanitizeAll = params => {
    for (let i in params) {
        if (typeof params[i] == 'string') params[i] = CleanXSS(params[i])
        else if (typeof params[i] == 'object') SanitizeAll(params[i])
        // params[i] = CleanSQLInjection(params[i])
    }
}

let handle_csrf = (req, res, next) => {
    if (myConfig.csrf_protection) {
        const randomstring = require('randomstring')
        let regenerate = true
        //check csrf
        if (req.is_ajax) regenerate = false
        if (req.method.toUpperCase() == 'POST') {
            if (req.body[myConfig.csrf_token_name] == undefined) {
                next(new MyError('Action is not allowed', 403))
                return
            }
            if (req.session.csrf_storage == undefined) {
                next(new MyError('Action is not allowed', 403))
                return
            } else {
                if (req.session.csrf_storage.indexOf(req.body[myConfig.csrf_token_name]) < 0) {
                    next(new MyError('Action is not allowed', 403))
                    return
                }
            }
        }
        if (regenerate) {
            req.session.csrf_token = randomstring.generate()
            if (req.session.csrf_storage == undefined) req.session.csrf_storage = new Array()
            req.session.csrf_storage.push(req.session.csrf_token)
            if (req.session.csrf_storage.length > myConfig.max_csrf) req.session.csrf_storage.shift()
        }
    }
}

let loadMiddlewares = (app, rootpath, basepath) => {
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')
    const session = require('express-session')
    const timeout = require('connect-timeout')
    const expressValidator = require('express-validator')
    const mongoSanitize = require('express-mongo-sanitize')
    const useragent = require('express-useragent')

    app.set('views', rootpath + '/views')
    app.set('view engine', 'pug')

    app.use(bodyParser.json({ limit: myConfig.max_post_size || '5mb' }))
    app.use(bodyParser.urlencoded({ limit: myConfig.max_post_size || '5mb', extended: true }))
    app.use(cookieParser())
    app.use(mongoSanitize())
    app.use(expressValidator())
    app.use(useragent.express())

    let max_session = 86400000
    if (myConfig.session_expired != undefined) max_session = myConfig.session_expired

    app.use(
        session({
            secret: myConfig.session_secret || 'its a secret!',
            name: myConfig.session_name || 'session_name',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: max_session
            }
            // ,store: new MongoStore({
            //     url: 'mongodb://localhost/ms_master',
            //     collection: 'sessions',
            //     autoRemove: 'native',
            //     stringify: true
            // })
        })
    )
    // PASSPORT
    require('../apps/v1/config/passport')(passport)
    app.use(passport.initialize())
    app.use(passport.session()) // persistent login sessions

    app.use(multer({ dest: os.tmpdir() }).any())

    //begin get & set header data
    // let setHeaders = function (req, res, next) {
    // myLogger.info('new-request', req.headers)
    //if required to check header
    // if (req.headers.hasOwnProperty('mony-user-data')) {
    //     req.user = JSON.parse(req.headers['mony-user-data'])
    // }else{
    //     next(new Error('Invalid User Information!'))
    // }
    //     next()
    // }

    // app.use(setHeaders)
    //end get & set header data

    app.use(
        bluebird.coroutine(function * (req, res, next) {
            //check first time memory usage
            req.memory_used = process.memoryUsage().heapUsed

            //check static file
            let is_static = false
            for (let i in myConfig.static_paths) {
                let regexp = new RegExp(myConfig.static_paths[i] + '*', 'gi')
                if (regexp.test(req.url)) {
                    is_static = true
                    break
                }
            }

            if (!is_static) {
                req.request_id = 0
                //check first time request
                req.start_process = new Date().getTime()

                //[William]: log
                myLogger.info('new-request', 'CLIENT IP: ' + req.ip)
                myLogger.info('new-request', 'URL: ' + req.url)
                // myLogger.info('new-request', 'HOST: ' + req.headers.host)
                // myLogger.info('new-request', 'ORIGIN: ' + req.headers.origin)
                // myLogger.info('new-request', 'User Agent: ' + req.headers['user-agent'])

                //define ajax or not
                req.is_ajax = req.headers.hasOwnProperty('x-requested-with')

                //define device type
                //parse user agent
                let device = uaparse(req.headers['user-agent'])

                req.is_mobile = false
                req.os = 'Desktop'
                if (device.os.name != undefined) req.os = device.os.name
                req.is_mobile = device.device.type != undefined && device.device.type == 'mobile'

                // [William]: enable CORS => di setting per apps sesuai dengan environment-nya
                // for(let i=0; i<myConfig.allowed_origin.length;  i++)
                // {
                //     let reg = myConfig.allowed_origin[i]
                //     if(reg[0] == '*')
                //     {
                //         reg = '[a-z0-9]' +  reg
                //     }
                //     let regexp = new RegExp(reg,'gi')
                //     let allow = ''
                //     if( regexp.test(req.ip))
                //     {
                //         allow = req.ip
                //     }
                //     else if(regexp.test(req.headers.origin))
                //     {
                //         allow = req.headers.origin
                //     }
                //     if(allow != '')
                //     {
                //         //if localhost allow all
                //         if(allow == '::1')
                //             allow = '*'
                //     }
                //     res.header("Access-Control-Allow-Origin", allow)
                // }

                // res.header('Access-Control-Allow-Origin', '*')
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept ' + myConfig.header_key)

                let idxCheckHeader = -1
                for (let i in myConfig.check_header) {
                    let regexp = new RegExp(myConfig.check_header[i] + '*', 'gi')
                    if (regexp.test(req.url)) {
                        idxCheckHeader = i
                        break
                    }
                }

                if (idxCheckHeader > -1) {
                    let idxNoHeader = -1
                    for (let i in myConfig.allowed_no_header) {
                        let regexp = new RegExp(myConfig.allowed_no_header[i] + '*', 'gi')
                        if (regexp.test(req.url)) {
                            idxNoHeader = i
                            break
                        }
                    }
                    if (idxNoHeader < 0) {
                        let token_data = null
                        let token_query = req.queries('token')
                        if (req.headers.hasOwnProperty(myConfig.header_key)) {
                            let token = req.headers[myConfig.header_key]
                            //cek token
                            token_data = yield token_query.check(req.db, token, req.ip, myConfig.token_match_ip)
                            req.token = token
                        }
                        let token_id = 0
                        if (req.url != '/' && req.method.toUpperCase() != 'OPTIONS') {
                            if (token_data == null) {
                                next(new MyError('Please provide correct token!', 402))
                                return
                            } else {
                                token_id = token_data.id
                                if (token_data.expired_date.getTime() <= new Date().getTime()) {
                                    next(new MyError('Token already expired!', 406))
                                    return
                                } else token_query.update_activity(req.db, token_data)
                            }
                            let obj = yield token_query.create_log(req.db, req, token_id)
                            if (obj != null) req.session.request_id = obj.dataValues.id
                            if (fs.existsSync(path.normalize(rootpath + '/' + basepath + '/apiaccess'))) {
                                let access = require(path.normalize(rootpath + '/' + basepath + '/apiaccess'))
                                if (access.check != undefined) {
                                    let res_check = yield access.check(req.db, req)
                                    if (!res_check) {
                                        next(new MyError('Page is not accessible!', 403))
                                        return
                                    }
                                }
                            }
                        }
                    }
                } else {
                    let idxNoCSRF = -1
                    for (let i in myConfig.csrf_bypass) {
                        let regexp = new RegExp(myConfig.csrf_bypass[i] + '*', 'gi')
                        if (regexp.test(req.url)) {
                            idxNoCSRF = i
                            break
                        }
                    }

                    //handle csrf if not static
                    if (idxNoCSRF < 0) handle_csrf(req, res, next)

                    let idxCheckAdmin = -1
                    for (let i in myConfig.validate_admin) {
                        let regexp = new RegExp(myConfig.validate_admin[i] + '*', 'gi')
                        if (regexp.test(req.url)) {
                            idxCheckAdmin = i
                            break
                        }
                    }

                    //handle csrf if not static
                    if (idxCheckAdmin >= 0 && req.url != myConfig.login_admin) {
                        if (req.session == undefined || req.session.admin_id == undefined || req.session.admin_id == 0) {
                            if (req.method.toUpperCase() == 'GET') {
                                res.redirect(myConfig.login_admin)
                                return
                            }
                            if (req.method.toUpperCase() == 'POST') {
                                next(new MyError('Action is not allowed', 403))
                                return
                            }
                        } else {
                            if (fs.existsSync(path.normalize(rootpath + '/' + basepath + '/access'))) {
                                let access = require(path.normalize(rootpath + '/' + basepath + '/access'))

                                if (access.check != undefined) {
                                    let res_check = yield access.check(req.db, req)
                                    if (!res_check) {
                                        res.redirect(myConfig.validate_admin[idxCheckAdmin])
                                        return
                                    }
                                }
                            }
                        }
                    }
                }

                //[William] : make more ci-fy
                req.input = {
                    get: req.query,
                    post: req.body
                }
                //[William]: clean up xss
                // SanitizeAll(req.input.get)
                // merubah post menjadi string
                // SanitizeAll(req.input.post)
            }
            next()
        })
    )

    app.use(nocache())
    app.use(timeout(myConfig.max_timeout || 300))
    // app.use(function (req, res, next){
    //     if (!req.timedout) next()
    // })

    if (ENV !== 'production') {
        // for environment other than production
        let morgan = require('morgan')

        app.use(morgan('dev'))
    } else {
        // for environment only on production
    }
}

module.exports = loadMiddlewares

'use strict'

const path = require("path")

let convert_byte = (byte) => {
    let arr = ['Byte','KB','MB','GB','TB']
    let idx = 0
    while(byte > 999 && idx < 5)
    {
        byte = Math.round(byte*100/1000)/100
        idx++
    }
    let size = ''
    if(idx >= 0 && idx <= arr.length-1)
        size = ' ' + arr[idx]
    if(byte < 0)
        byte = 0
    return byte.format(2,3) + size
}

let update_log = (db, req, id, data, action, end_time, memory_usage, elapse_time, api_version)=>{
    if(id != 0 && id != undefined && id != null){
        let q = req.queries('token')
        q.update_log(db, id, data, action, end_time, memory_usage, elapse_time, api_version)
    }
}

module.exports = fw => {
    fw.use((req, res, next) => {
        res.source_url = req.url

        res._render = res.render

        res.render = (view, data = {}) => {
            bluebird.coroutine(function*(){
                let menus = []
                let curr_dt = new Date()
                data.csrf_token = req.session.csrf_token
                data.csrf_token_name = myConfig.csrf_token_name
                data.succ_message = ''
                data.err_message = ''
                data.basedir = path.normalize(__dirname + "/../views")
                if(req.session != undefined){
                    if(req.session.succ_message != undefined && req.session.succ_message != '')
                        data.succ_message = req.session.succ_message
                    if(req.session.err_message != undefined && req.session.err_message != '')
                        data.err_message = req.session.err_message
                    req.session.succ_message = ''
                    req.session.err_message = ''
                    let user_menus = []
                    if(req.session.admin_id != undefined && req.session.admin_id != 0){
                        let uq = req.queries("admin")
                        user_menus = yield uq.get_user_menu(req.db, req.session.admin_id, res.source_url)
                    }
                    data.user_menus = user_menus
                }
                update_log(req.db, req, req.session.request_id, data, 'render', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
                res._render(view, data)

            })()
        }

        res.setHeader('Version', myConfig.version)

        res.success = (data, status_code = 200) => {

            let curr_dt = new Date()

            update_log(req.db, req, req.session.request_id, data, 'success', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            res.status(200).json({
                api_version: myConfig.version,
                memory_usage: convert_byte(process.memoryUsage().heapUsed - req.memory_used),
                elapse_time: (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3),
                lang: 'en',
                error: {},
                data: data
            })
        }

        res.unauthorized = (data, status_code = 401) => {

            let curr_dt = new Date()

            update_log(req.db, req, req.session.request_id, data, 'unauthorized access', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            res.status(401).json({
                api_version: myConfig.version,
                memory_usage: convert_byte(process.memoryUsage().heapUsed - req.memory_used),
                elapse_time: (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3),
                lang: 'en',
                error: {},
                data: data
            })
        }

        res.html = (html, status_code = 200) => {
            res.send(html)
        }

        res.raw = (data, status_code = 200) => {
            let curr_dt = new Date()
            data.api_version = myConfig.version
            data.memory_usage = convert_byte(process.memoryUsage().heapUsed - req.memory_used)
            data.elapse_time = (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3)
            data.lang = 'en'
            // data.error = {}
            update_log(req.db, req, req.session.request_id, data, 'raw', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            res.status(200).json(data)
        }

        res.error = (err, status_code = 570, error_data = {}) => {
            let message = ''
            let data = []

            // if err is string
            if (typeof err === 'string') {
                // message = err
                data.push({
                    code: error_data.error_code || status_code,
                    message: error_data.error_message || err,
                    data: error_data
                });
            }
            // if err is object
            else if (typeof err === 'object') {
                if(Object.prototype.toString.call( err ) === '[object Array]')
                {
                    for(let i in err)
                    {
                        data.push({
                            code: status_code,
                            message: err[i]
                        })
                    }
                }
                else if (!err.errors) {
                    // message = err.message
                    data.push({
                        code: status_code,
                        message: message
                    })
                } else {
                    // message = err.errors
                    data = [{
                        code: status_code,
                        message: err.errors
                    }]
                }
            }
            let curr_dt = new Date()
            update_log(req.db, req, req.session.request_id, data, 'error', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            res.status(200).json({
                api_version: myConfig.version,
                memory_usage: convert_byte(process.memoryUsage().heapUsed - req.memory_used),
                elapse_time: (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3),
                lang: 'en',
                error: {
                    code: error_data ? error_data.error_code : status_code,
                    message: data[0].message,
                    errors: data
                },
                data: {}
            })
        }

        res.notfound = message => {
            let curr_dt = new Date()
            update_log(req.db, req, req.session.request_id, {}, 'notfound', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            res.status(404).json({
                api_version: myConfig.version,
                memory_usage: convert_byte(process.memoryUsage().heapUsed - req.memory_used),
                elapse_time: (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3),
                lang: 'en',
                error:{
                    code: 404,
                    message: message,
                    errors: [{
                        code: 404,
                        message: message
                    }]
                },
                data: {}
            })
        }

        res.error_lib = {
            OTHER_ERR: {
                error_code : 570,
                error_message: "Miscelanous Error"
            },
            LOGIN: {
                error_code: 471,
                error_message: "User and Password combination is not available"
            },
            OTP: {
                error_code: 472,
                error_message: "Unverified OTP"
            },
            RETRY: {
                error_code: 473,
                error_message: "Max Login retry reached"
            },
            UNAUTHORIZED: {
                error_code: 474,
                error_message: "Unauthorized Access"
            },
        }

        next()
    })
}
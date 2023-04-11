'use strict'

let upload_single_file = (file, destination) => new Promise((resolve, reject) => {
    let new_name = file.originalname
    let names = new_name.split(".")
    let n_name = ""
    for(let j=0; j<names.length - 1 ; j++)
    {
        n_name += names[j]
        if(j<names.length - 2)
            n_name += "."
    }
    n_name += ('_' + Math.round(new Date().getTime()/1000) + "." + names[names.length-1])
    // fs.renameSync(file.path, destination + n_name)
    // fs.createReadStream(file.path).pipe(fs.createWriteStream(destination + n_name))
    var cbCalled = false;
    var rd = fs.createReadStream(file.path);
    rd.on("error", function(err) {
        reject(err)
    })
    var wr = fs.createWriteStream(destination + n_name);
    wr.on("error", function(err) {
        reject(err)
    })
    wr.on("close", function(ex) {
        resolve(n_name)
    })
    rd.pipe(wr)
})

let fn = (fw, rootpath, basepath) => {
    const path = require('path')
    const fn = {}

    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')'
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,')
    }

    // attach rootpath and basepath
    fn.rootpath = rootpath
    fn.basepath = basepath

    // set main router
    fn.router = (param) => {
        const router = require('express').Router()

        param(fn, router)

        fw.use(router)
    }

    // require a route file
    fn.route = (routeName, dir) => {
        let callback = null
        if(dir != undefined && fs.existsSync(path.normalize(dir + '/' + routeName.toLowerCase() + '.js')))
            callback = require(path.normalize(dir + '/' + routeName.toLowerCase() + '.js'))
        else if(dir != undefined && fs.existsSync(path.normalize(dir + '/' + routeName.toLowerCase())))
            callback = require(path.normalize(dir + '/' + routeName.toLowerCase()))
        else if(dir != undefined && fs.existsSync(rootpath + '/' + basepath + '/routes/' + dir + '/' + routeName.toLowerCase() + '.js'))
            callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + dir + '/' + routeName.toLowerCase()))
        else if(dir != undefined && fs.existsSync(rootpath + '/' + basepath + '/routes/' + dir + '/' + routeName.toLowerCase()))
            callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + dir + '/' + routeName.toLowerCase()))
        else if(fs.existsSync(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase() + '.js')))
            callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase() + '.js'))
        else if (fs.existsSync(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase())))
            callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase()))
        else{
            throw new MyError("Route " + routeName + " is not found",403)
            return
        }
        
        const router = require('express').Router()

        callback(fn, router)

        return router
    }

    // require a filter file
    fn.filter = (filterName) => require(path.normalize(rootpath + '/' + basepath + '/filters/' + filterName.toLowerCase() + '.js'))

    // require a controller file
    fn.controller = (controllerName) => {
        return require(path.normalize(rootpath + '/' + basepath + '/controllers/' + controllerName.toLowerCase() + '.js'))
    }

    // attach database handling on framework request object
    fw.request.db = fw.db

    // attach lib function on framework request object
    fw.request.lib = (libName) => {
        //[William]: move lib to core
        if(fs.existsSync(rootpath + '/' + basepath + '/libs/' + libName.toLowerCase() + '.js'))
            return require(path.normalize(rootpath + '/' + basepath + '/libs/' + libName.toLowerCase() + '.js'))
        else
            return require(path.normalize(rootpath + '/core/libs/' + libName.toLowerCase() + '.js'))
    }
    //[William]: suggest to move query to another file not in controller
    fw.request.queries = (libName) => require(path.normalize(rootpath + '/' + basepath + '/queries/' + libName.toLowerCase() + '.js'))

    //[William]: suggest to check required
    fw.request.validate = (req, param)=> {
        let val = require(rootpath + '/core/validator')
        let validator = new val(rootpath + '/' + basepath)
        let err = []
        let res = []
        for(let i in param)
        {
            if(typeof(param[i]) == 'object' && typeof(param[i]['name']) == 'undefined')
                continue
            
            if(typeof(param[i]) == 'string')
                res = validator.validate(req,param[i], ['required'])
            else if(typeof(param[i]) == 'object' && typeof(param[i]['rules']) == 'undefined')
                res = validator.validate(req,param[i]['name'], ['required'])
            else
                res = validator.validate(req,param[i]['name'], param[i]['rules'])
            if(res.length > 0)
            {
                if(typeof(param[i]['message']) != 'undefined')
                    err.push(param[i]['message'])
                else
                    err = err.concat(res)
            }
        }
        if(err.length > 0)
            throw new MyError(err,403)
    }

    fw.request.move_uploaded_file = (req, fieldname, destination, is_array = false) => new Promise((resolve, reject)=>{
        bluebird.coroutine( function*(){
            let found = false
            let ret = new Array()
            for(let i in req.files)
            {
                if(req.files[i].fieldname == fieldname)
                {
                    let res = yield upload_single_file(req.files[i], destination)
                    if(!is_array){
                        resolve(res);
                        break;
                    }
                    else
                        ret.push(res)
                    found = true
                }
            }
            if(!found)
                reject("No selected file")
            else
                resolve(ret)
        })()
    })

    fw.request.rootpath = rootpath

    return fn
}

module.exports = fn

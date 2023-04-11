'use strict'

let core = (fw) => {
    let $initialize = false

    // set framework options
    fw.set('x-powered-by', false)
    fw.set('trust proxy', true)

    // set template engine

    // extend response
    require('./response.js')(fw)

    return {
        init: (rootpath, basepath) => {

            // load logger
            global.myLogger = require('./logger.js')
            global.MyError = require('./libs/error.js')

            //[William]: set global bluerbird
            global.bluebird = require('bluebird')
            global.fs = require('fs')

            global.services = require(path.join(rootpath, basepath, 'config', 'service'));

            if ($initialize) {
                throw new MyError('Application has been initialized!',500)
                return
            }

            $initialize = true

            // initialize database connection
            fw.db = require('./dbcore/index.js')(
            //     {
            //     host: process.env.DB_HOST,
            //     user: process.env.DB_USER,
            //     password: process.env.DB_PASSWORD,
            //     database: process.env.DB_NAME,
            //     log: ENV !== 'production'
            // }
            require(rootpath + '/' + basepath + '/config/' + ENV + '/database.js')
            , rootpath, basepath)

            // load  middlewares
            require('./middlewares.js')(fw, rootpath, basepath)

            // load application
            let app = require(rootpath + '/' + basepath)

            // load core functions
            let fn = require('./functions.js')(fw, rootpath, basepath)

            app(fn)

            fw.use((req, res, next)=>{
                console.log("hello world " + req.url);
                next();
            })

            for(let i in myConfig.static_files)
            {
                let stat = myConfig.static_files[i]
                fw.use("/" + stat, express.static(path.join(rootpath, stat)))
            }

            // non existing route
            fw.use((req, res) => {
                let idxCheckHeader = -1
                for(let i in myConfig.check_header)
                {
                    let regexp = new RegExp(myConfig.check_header[i] + "*",'gi')
                    if(regexp.test(req.url))
                    {
                        idxCheckHeader = i
                        break
                    }
                }
                if(idxCheckHeader > -1)
                    res.notfound('Page not found!')
                else
                    res.notfound('Not found!')
            })
            // error handler
            fw.use((err, req, res, next) => {
                global.myLogger.error(err)
                res.error(err.message, err.code)
            })
        }
    }
}

module.exports = core

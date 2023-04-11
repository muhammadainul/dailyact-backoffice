'use strict';

module.exports = (config, rootpath, basepath) => {

    const DB = require('./db.js')(rootpath, basepath);

    // global.Sequelize = require('sequelize');
    global.mongoose = require('mongoose');
    global.mongoose_error_handler = require('../../apps/v1/libs/mongoose_error_handler');
    mongoose.set('debug', config.dbconfig.log || false);
    // global.db = new DB;

    const options = {
        user               : config.dbconfig.user,
        pass               : config.dbconfig.pass,
        useNewUrlParser    : config.dbconfig.useNewUrlParser,
        useCreateIndex     : config.dbconfig.useCreateIndex,
        useFindAndModify   : config.dbconfig.useFindAndModify,
        autoIndex          : config.dbconfig.autoIndex,
        reconnectTries     : config.dbconfig.reconnectTries,
        reconnectInterval  : config.dbconfig.reconnectInterval,
        poolSize           : config.dbconfig.poolSize,
        bufferMaxEntries   : config.dbconfig.bufferMaxEntries,
        connectTimeoutMS   : config.dbconfig.connectTimeoutMS,
        socketTimeoutMS    : config.dbconfig.socketTimeoutMS,
        family             : config.dbconfig.family,
        useUnifiedTopology : config.dbconfig.useUnifiedTopology
    };

    // global.db = mongoose.connect('mongodb://' + config.dbconfig.host + '/' + config.dbconfig.database + '?authSource=' + config.dbconfig.authSource, options);
    global.db = mongoose
        .connect(config.dbconfig.protocol + "://" + config.dbconfig.host + "/" + config.dbconfig.database + "?authSource=" + config.dbconfig.authSource, options)
        .then(() => console.log("DB connected: " + config.dbconfig.host + "/" + config.dbconfig.database), err => console.log("Connection error"));

    return db;

    // let log = true
    // if(config.dbconfig.log != undefined)
    //     log = config.dbconfig.log
    // db.addConnection('default', {
    //     host: config.dbconfig.host,
    //     user: config.dbconfig.username,
    //     password: config.dbconfig.password,
    //     database: config.dbconfig.database,
    //     log: log,
    //     dialect: config.dbconfig.dialect,
    //     timezone: process.env.TZ
    // }, true);

    // return db.connection();
}

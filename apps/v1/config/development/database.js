'use strict'

exports.dbconfig = {
    protocol          : "mongodb+srv",
    user              : "dev",
    pass              : "yKc22UVKi*WVVc.",
    host              : "devcluster-fkkmm.mongodb.net",
    database          : "ms_bo",
    authSource        : 'admin',
    useNewUrlParser   : true,
    useCreateIndex    : true,
    useFindAndModify  : false,
    autoIndex         : false,                            // Don't build indexes
    reconnectTries    : Number.MAX_VALUE,                 // Never stop trying to reconnect
    reconnectInterval : 500,                              // Reconnect every 500ms
    poolSize          : 2,                                // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries   : 0,
    connectTimeoutMS   : 10000,   // Give up initial connection after 10 seconds
    socketTimeoutMS    : 45000,   // Close sockets after 45 seconds of inactivity
    family             : 4,       // Use IPv4, skip trying IPv6
    useUnifiedTopology : true
}

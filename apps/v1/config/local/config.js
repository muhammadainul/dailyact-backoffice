module.exports = {
    version           : "0.0.1",
    base_url          : "http://localhost:3099/",
    token_match_ip    : false,
    allowed_no_header : ["/api/token/"],
    check_header      : ["/api/"],
    allowed_origin    : ["localhost", "192.168.*", "127.*", "::1"],
    logged_page       : [],
    static_files      : ["images", "uploads", "assets"],
    static_paths      : ["/images", "/assets"],
    max_timeout       : 300000,                                         //in milliseconds
    max_post_size     : "100mb",
    session_expired   : 86400000,                                       //in milliseconds
    session_secret    : "p@ssw0rd",
    session_name      : "da_user_session",
    csrf_protection   : false,
    csrf_token_name   : "",
    csrf_bypass       : ["/"],
    validate_admin    : [],
    login_admin       : "/",
    max_csrf          : 10,
    smtp              : {
        host   : "smtp.gmail.com",
        port   : 465,
        secure : true,                 // true for 465, false for other ports
        auth   : {
            user : "dailyactordeveloper@gmail.com",
            pass : "DAteamDeveloper888"
        }
    },
    cacheEnabled : true,
    cacheOptions : {
        stdTTL      : 60,     // in seconds
        checkperiod : 15      // in seconds
    },
    paging: {
        subscribe: {
            page       : 1,
            offset     : 0,
            numOfItems : 12
        }
    },
    crypto: {
        algorithm: 'aes-256-ctr',
        key: 'D@ilyAct-Local'
    }
};

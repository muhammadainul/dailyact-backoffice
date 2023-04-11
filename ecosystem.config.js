let watch = false;
let instances = 1;
let exec_mode = "fork";

module.exports = {
    apps: [
        {
            name: "back-office",
            cwd: "/var/www/git-project/back-office",
            script: "./server.js",
            exp_backoff_restart_delay: 100,
            instances:1,
            exec_mode,
            max_memory_restart: "256M",
            autorestart: true,
            env: {
                Z:"Asia/Jakarta",
                NAMESPACE:"back-office",
                APPID:1,
                PORT:3019,
                VERSION:"1.0.0",
                NODE_ENV:"development",
        		// DEBUG:"bo:*,queries:*"
            },
            env_production: {
                Z:"Asia/Jakarta",
                NAMESPACE:"back-office",
                APPID:1,
                PORT:3019,
                VERSION:"1.0.0",
                NODE_ENV:"production"
            }
        }
    ]
};

"use strict";

// load all the things we need
const LocalStrategy = require("passport-local").Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const TwitterStrategy  = require('passport-twitter').Strategy;
// const GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// const request = require("request");
// const passportJWT = require("passport-jwt");
// const JWTStrategy   = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;

const { check_password } = require("../libs/password");
// load up the user model
const User = require("../models/user");

// load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        const log = require("debug")("passport:serializeUser");
        log("serializeUser", user);
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(async (id, done) => {
        const log = require("debug")("passport:deserializeUser");
        log("deserializeUser", id);
        try {
            let user = await User.findById(id, '_id admin username local.email').lean();
            log("user", user);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });

    // LOCAL STRATEGY
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            const log = require("debug")("passport:LocalStrategy");
            log("LocalStrategy", { username, password });
            try {
                let user = await User.findOne({ username }).lean();
                if (!user) return done(null, false);
                if (!check_password(user.local.password, password)) return done(null, false);
                log("user", user);
                return done(null, user);
            } catch (error) {
                done(error);
            }
        })
    );

    // PASSPORT JWT
    // passport.use(
    //     new JWTStrategy(
    //         {
    //             jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    //             secretOrKey: myConfig.session_secret
    //         },
    //         (jwtPayload, done) => {
    //             // console.log('jwtPayload', jwtPayload)
    //             // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    //             if (jwtPayload) return done(null, jwtPayload);
    //             else return done(false, null);
    //         }
    //     )
    // );
};

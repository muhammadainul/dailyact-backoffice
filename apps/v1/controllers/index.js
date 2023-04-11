"use strict";

const debug    = require("debug");
const _        = require("lodash");
const passport = require("passport");
const moment   = require("moment");

let getAccessToken = async ({ authorization }) => {
    const log = debug("page:getAccessToken");
    let   str = _.split(authorization, " ");
    log("access token: Bearer", str[1]);
    return str[1];
};

let formRefill = body => {
    delete body.password;
    delete body.password2;
    return body;
};

let parseHobbies = hobbies => {
    return _.map(_.split(hobbies, ","), _.trim);
};

exports.ping = (req, res, next) => {
    const log = debug("bo:ping");
    res.success({ message: "This is Back-Office" });
};

exports.indexPage = async (req, res, next) => {
    const log = debug("bo:index");
    try {
        res.render("pages/index");
    } catch (error) {
        next(error);
    }
};

exports.registerPage = async (req, res, next) => {
    const log = debug("bo:registerPage");
    try {
        log("[DA] Render register page");
        // res.render("pages/register");
        res.redirect("/admin");
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    const log    = debug("bo:register");
    let   errors = req.validationErrors();
    if (!_.isEmpty(errors))
        return res.render("pages/register", {
            error : errors
        });
    try {
        log("[DA] add new admin:", req.body);
        if (!_.isEmpty(errors))
            return res.render("pages/admin/index", {
                adminList : await req.queries("user").getAll(),
                register  : { errors, refill: await formRefill(req.body) }
            });
        const { username, email, password } = req.body;
        let   checkUser                     = await req.queries("user").getByUsername(username);
        if (checkUser)
            return res.render("pages/admin/index", {
                adminList : await req.queries("user").getAll(),
                register  : { error: "User already existed." }
            });
        let checkEmail = await req.queries("user").getByEmail(email);
        if (checkEmail)
            return res.render("pages/admin/index", {
                adminList : await req.queries("user").getAll(),
                register  : { error: "Email already used." }
            });
        // const { firstname, lastname, sex, birthday } = detail;
        let userObj = {
            username,
            local: {
                email,
                password : req.lib("password").encrypt_password(password)
            },
            admin : true
        };
        let newUser   = await req.queries("user").new(userObj);
        let detailObj = {
            userId : newUser._id,
            username
        };
        let newDetail  = await req.queries("userdetail").new(detailObj);
        let updateUser = await req
            .queries("user")
            .updateById(newUser._id, { userDetail: newDetail._id });
        // res.success(updateUser);
        res.redirect("/admin/list");
    } catch (error) {
        next(error);
    }
};

exports.loginPage = async (req, res, next) => {
    const log = debug("bo:loginPage");
    try {
        log("[DA] Render login page");
        res.render("pages/login");
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const log    = debug("bo:login");
    let   errors = req.validationErrors();
    if (!_.isEmpty(errors))
        return res.render("pages/login", {
            error : errors
        });
    try {
        log("[DA] Loggin in", req.body);
        let { username, password } = req.body;
        let user                   = await req.queries("user").getByUsername(username);
        if (_.isNull(user))
            return res.error("Unauthorized access. Please login.", 570, res.error_lib.UNAUTHORIZED);
        let passCheck = await req.lib("password").check_password(user.local.password, password);
        if (!passCheck)
            return res.error("Unauthorized access. Please login.", 570, res.error_lib.UNAUTHORIZED);
        let auth     = user.toAuthJSON();
        let updateAT = await req.queries("user").updateAccessToken({
            id            : user.id,
            username      : user.username,
            access_token  : auth.access_token,
            refresh_token : auth.refresh_token
        });
        // res.success(updateAT);
        delete updateAT.local.password;
        res.render("pages/index", {
            user : updateAT
        });
    } catch (error) {
        next(error);
    }
};

exports.passportLogin = async (req, res, next) => {
    const log    = debug("bo:passportLogin");
    let   errors = req.validationErrors();
    if (!_.isEmpty(errors))
        return res.render("pages/login", {
            error : errors
        });
    try {
        log("errors", errors);
        if (!_.isEmpty(errors)) return res.render("pages/login", { errors });
        log("[DA] Login using Passport Local", req.body);
        passport.authenticate("local", (err, user, info) => {
            if (err) return next(error);
            if (!user)
                return res.render("pages/login", {
                    error : "Wrong Credentials"
                });
            req.logIn(user, err => {
                if (err) return next(err);
                return res.redirect("/");
            });
        })(req, res, next);
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res, next) => {
    const log = debug("bo:logout");
    log("[DA] Logout", req.user);
    req.logout();
    res.redirect("/login");
};

exports.adminPage = async (req, res, next) => {
    const log = debug("bo:adminPage");
    try {
        log("[DA] Render Administration page");
        res.render("pages/admin/index", {
            adminList : await req.queries("user").getAll()
        });
    } catch (error) {
        next(error);
    }
};

exports.adminProfilePage = async (req, res, next) => {
    const log  = debug("bo:adminProfilePage");
    const user = req.user;
    log("[DA] Render Admin Detail page", { user });
    try {
        let viewed = await req.queries("user").getById(req.params.userid);
        delete viewed.local.password;

        res.render("pages/admin/profile", {
            user     : viewed,
            editable : viewed._id.toString() == user._id ? true : false
            // raw: true
        });
    } catch (error) {
        next(error);
    }
};

exports.adminUserEditPage = async (req, res, next) => {
    const log  = debug("bo:adminProfilePage");
    const user = req.user;
    log("[DA] Render Admin Edit User page");
    try {
        let tobeEdited = await req.queries("user").getById(req.params.userid);

        res.render("pages/admin/profile", {
            user     : tobeEdited,
            useredit : true,
            editable : tobeEdited._id.toString() == user._id ? true : false
        });
    } catch (error) {
        next(error);
    }
};

exports.adminUserUpdate = async (req, res, next) => {
    const log  = debug("bo:adminUserUpdate");
    const user = req.user;
    const body = req.body;
    log("[DA] Admin Edit User", { user, body });
    try {
        let {
            userid,
            username,
            email,
            country_code,
            mobile,
            verifyotp         = false,
            enabled           = false,
            accountNonExpired = false,
            accountNonLocked  = false,  
            admin             = false
            }                 = body;
        let updated = await req.queries("user").updateById(userid, {
            username,
            "local.email" : email,
            country_code,
            mobile,
            verifyOTP : verifyotp,
            enabled,
            accountNonExpired,
            accountNonLocked,
            admin
        });

        res.redirect("/admin/profile/" + userid);
    } catch (error) {
        next(error);
    }
};

exports.adminUserDetailEditPage = async (req, res, next) => {
    const log  = debug("bo:adminProfilePage");
    const user = req.user;
    log("[DA] Render Admin Edit User page");
    try {
        let tobeEdited = await req.queries("user").getById(req.params.userid);
        let genderList = _.map(await req.queries("master").getGenderList(), "sex");
        log("genderList", genderList);
        tobeEdited.userDetail.birthday = moment(tobeEdited.userDetail.birthday).format(
            "YYYY/MM/DD"
        );
        log("tobeEdited.userDetail", tobeEdited.userDetail);

        res.render("pages/admin/profile", {
            user  : tobeEdited,
            lists : {
                gender : genderList
            },
            detailedit : true,
            editable   : tobeEdited._id.toString() == user._id ? true : false
        });
    } catch (error) {
        next(error);
    }
};

exports.adminUserDetailUpdate = async (req, res, next) => {
    const log  = debug("bo:adminUserDetailUpdate");
    const user = req.user;
    const body = req.body;
    log("[DA] update User Detail", { user, body });
    try {
        let { userdetailid, userid, firstname, lastname, sex, hobbies, birthday, isprivate } = body;

        let updated = await req.queries("userdetail").updateById(userdetailid, {
            firstname,
            lastname,
            sex,
            hobbies   : await parseHobbies(hobbies),
            birthday  : await moment(birthday).format("YYYY-MM-DD"),
            isPrivate : isprivate
        });
        res.redirect("/admin/profile/" + userid);
    } catch (error) {
        next(error);
    }
};

exports.adminRolesPage = async (req, res, next) => {
    const log  = debug("bo:adminRolesPage");
    const user = req.user;
    log("[DA] Render Admin Roles page");
    try {
        let roleList      = await req.queries("role").getAll();
        let privilegeList = await req.queries("privilege").getAll();

        res.render("pages/admin/roles", {
            roleList,
            privilegeList
        });
    } catch (error) {
        next(error);
    }
};

exports.adminRolesAdd = async (req, res, next) => {
    const log                               = debug("bo:adminRolesAdd");
    const user                              = req.user;
    const { role, description, privileges } = req.body;
    log("[DA] Add new role of admin", { role, description, privileges });
    try {
        let newRole = await req.queries("Role").add({
            role,
            description
        });

        res.redirect("/admin/roles");
    } catch (error) {
        next(error);
    }
};

exports.adminRolesEditPage = async (req, res, next) => {
    const log  = debug("bo:adminRolesEditPage");
    const user = req.user;
    log("[DA] Render Edit Role page");
    try {
        let roleList = await req.queries("Role").getAll();

        let tobeEdited = await req.queries("role").getById(req.params.roleid);

        res.render("pages/admin/roles", {
            role : tobeEdited,
            roleList,
            roleedit : true
        });
    } catch (error) {
        next(error);
    }
};

exports.adminRolesUpdate = async (req, res, next) => {
    const log  = debug("bo:adminRolesUpdate");
    const user = req.user;
    const body = req.body;
    log("[DA] Render Edit Role page", { body });
    try {
        let { roleid, role, description, privileges = [] } = body;
        let updated                                        = await req.queries("role").updateById(roleid, {
            role,
            description,
            privileges
        });
        res.redirect("/admin/roles");
    } catch (error) {
        next(error);
    }
};

exports.adminPrivilegeAdd = async (req, res, next) => {
    const log                                               = debug("bo:adminPrivilegeAdd");
    const user                                              = req.user;
    const { privilege, description, service, actions = [] } = req.body;
    log("[DA] Add new privilege of admin", { privilege, description, service, actions });
    try {
        let newPrivilege = await req.queries("privilege").add({
            privilege,
            description,
            service,
            actions
        });

        res.redirect("/admin/roles");
    } catch (error) {
        next(error);
    }
};

exports.adminPrivilegeEditPage = async (req, res, next) => {
    const log  = debug("bo:adminPrivilegeEditPage");
    const user = req.user;
    log("[DA] Render Edit Privilege page");
    try {
        // let roleList = await req.queries("role").getAll();
        let privilegeList = await req.queries("privilege").getAll();

        let tobeEdited = await req.queries("privilege").getById(req.params.privilegeid);

        res.render("pages/admin/roles", {
            privilege : tobeEdited,
            // roleList,
            privilegeList,
            privilegeedit : true
        });
    } catch (error) {
        next(error);
    }
};

exports.adminPrivilegeUpdate = async (req, res, next) => {
    const log  = debug("bo:adminPrivilegeUpdate");
    const user = req.user;
    const body = req.body;
    log("[DA] Update Privilege ", { body });
    try {
        let { privilegeid, privilege, description, service = null, actions = [] } = body;

        let updated = await req.queries("privilege").updateById(privilegeid, {
            privilege,
            description
            // service,
            // actions
        });
        res.redirect("/admin/roles");
    } catch (error) {
        next(error);
    }
};
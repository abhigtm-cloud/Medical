const express = require('express');
const router = express.Router();
const User = require('../models/user');

const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveUrl } = require('../middleware.js');
const UserController = require("../controller/user.js");

router
.route("/signup")
.get(UserController.RenderPage)
.post( wrapAsync(UserController.Posting));


router
.route("/login")
.get( UserController.login)
.post( saveUrl,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),UserController.Log );



router.get("/logout",UserController.Logout);


module.exports = router;

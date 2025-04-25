const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isloggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: 'login', failureFlash: true }),
        userController.login
    );

router.get("/logout", userController.logout);

// User Profile Routes
router.get("/user/profile", isloggedIn, userController.renderUserProfile);
router.get("/user/listings", isloggedIn, userController.renderMyListings);
router.get("/user/trips", isloggedIn, userController.renderMyTrips);

module.exports = router;

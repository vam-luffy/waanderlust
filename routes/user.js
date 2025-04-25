const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isloggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");
const multer = require("multer");
const { storage } = require("../cloudinary/index");

// Configure Multer with file size limits
const upload = multer({ 
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // limit to 2MB
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

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

// Edit Profile Routes
router.route("/user/edit")
    .get(isloggedIn, userController.renderEditProfileForm)
    .post(isloggedIn, (req, res, next) => {
        upload.single("image")(req, res, (err) => {
            if (err) {
                console.error("Multer error:", err);
                req.flash("error", `Upload error: ${err.message}`);
                return res.redirect("/user/edit");
            }
            
            // Continue to the controller function directly
            next();
        });
    }, wrapAsync(userController.updateProfile));

// Wishlist Routes
router.get("/user/wishlist", isloggedIn, wrapAsync(userController.renderWishlist));
router.post("/user/wishlist/:listingId", isloggedIn, wrapAsync(userController.toggleWishlistItem));
router.get("/user/wishlist/:listingId/status", isloggedIn, wrapAsync(userController.checkWishlistStatus));

module.exports = router;

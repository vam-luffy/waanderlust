const express = require("express");
const router = express.Router();  // Properly instantiate Router
const wrapAsync = require("../utils/wrapAsync");
const listing = require("../models/listing.js");
const methodOverride = require("method-override");
const{isloggedIn,isOwner,validateListing}=require("../middleware.js");
const listingControllers =require("../controllers/listings.js")
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingControllers.index))
    .post(isloggedIn,
        // validateListing,
        upload.single('listing[image][url]'), 
        wrapAsync(listingControllers.createListing)
    );


// Show the form to create a new listing
router.get("/new",isloggedIn,listingControllers.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingControllers.showListing))
    .put(isloggedIn,
        isOwner, 
        validateListing,
        upload.single('listing[image][url]'), 
        wrapAsync(listingControllers.updateListing

    ))
    .delete(isloggedIn,
        isOwner, 
        wrapAsync(listingControllers.destroyListing

    ))
//edit
router.get("/:id/edit",
    isloggedIn,
    
    isOwner,
     wrapAsync(listingControllers.renderEditForm));

module.exports = router;

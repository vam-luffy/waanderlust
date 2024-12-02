const express = require("express");
const router = express.Router({mergeParams:true});  // Properly instantiate Router
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const {  reviewSchema } = require("../schema");
const listing = require('../models/listing');  // Adjust the path if needed
const{validateReview,isloggedIn, isReviewAuthor}=require("../middleware.js");
const reviewControllers=require("../controllers/reviews.js")

router.post("/", validateReview,isloggedIn, wrapAsync(reviewControllers.createReview));

router.delete("/:reviewId",isloggedIn,isReviewAuthor, wrapAsync(reviewControllers.destroyReview));

module.exports=router
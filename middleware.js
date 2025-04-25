const listing=require("./models/listing");
const Review=require("./models/review");
const { listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isloggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl=req.originalUrl;;
        req.flash("error","you are not logged in please login ")
        res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
try{
    const { id } = req.params;
    const Listing = await listing.findById(id); 
    // console.log('Listing:', Listing);
    
    // Check if Listing exists and has an owner
    if (!Listing || !Listing.owner || !Listing.owner._id) {
        req.flash("error", "Listing not found or owner data is missing");
        console.log('Redirecting: Listing not found or owner data is missing');
        return res.redirect(`/listings/${id}`);
    }

    // Check if currentUser is defined
    if (!res.locals.currentUser) {
        req.flash("error", "You need to be logged in to perform this action");
        console.log('Redirecting: User is not logged in');
        return res.redirect(`/listings/${id}`);
    }

    console.log('Listing owner _id:', Listing.owner._id);
    console.log('Current user _id:', res.locals.currentUser._id);

    // Check if the current user is the owner
    if (!Listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission");
        console.log('Redirecting: User does not have permission');
        return res.redirect(`/listings/${id}`);
    }

    console.log('Proceeding to next middleware');
    next();  // Proceed to the next middleware or route handler
}catch(err){
    console.log(err)
}
}

// Middleware to check if user is an admin
module.exports.isAdmin = async (req, res, next) => {
    try {
        // Check if user is logged in
        if (!req.user) {
            req.flash("error", "You need to be logged in to access admin area");
            return res.redirect("/login");
        }
        
        // Check if user has admin role
        // Note: This assumes you have an 'isAdmin' field in your User model
        // You might need to adjust this based on your actual user model structure
        if (!req.user.isAdmin) {
            req.flash("error", "You don't have permission to access the admin area");
            return res.redirect("/listings");
        }
        
        next();
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};

module.exports.validateListing = (req, res, next) => {
     // Debugging log
    const { error } = listingSchema.validate(req.body); // Directly validate req.body without wrapping
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        return next(new ExpressError(400, errMsg)); // Pass validation error
    }
    next(); // Proceed to next middleware
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    }
    next();
};

module.exports.isReviewAuthor=async (req,res,next)=>{
    const { id,reviewId } = req.params;
    let Listing = await listing.findById(id);
    let review = await Review.findById(reviewId).populate('author');
    if (!review.author || !review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You didnt create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

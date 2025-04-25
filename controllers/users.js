const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.renderSignupForm=(req, res) => {  // Corrected the route path and file name
    res.render("users/signup.ejs");    // Corrected the file name
}
module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(er)=>{
            if(er){
                return next(err)
            }
            req.flash("success","Rregistered,Wlecome to wanderLust")
            res.redirect("/listings")
        })

    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")

    }

}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login= async(req,res)=>{
    req.flash("success","wlecome back to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);

}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // Pass any error to the next middleware (error handler)
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");  // Redirect only after logout is complete
    });
}

// User Profile Controller
module.exports.renderUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/listings");
        }
        res.render("users/profile.ejs", { user });
    } catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};

// My Listings Controller
module.exports.renderMyListings = async (req, res) => {
    try {
        const userListings = await Listing.find({ owner: req.user._id });
        res.render("users/my-listings.ejs", { listings: userListings });
    } catch (err) {
        req.flash("error", "Error fetching your listings");
        res.redirect("/user/profile");
    }
};

// My Trips Controller
module.exports.renderMyTrips = async (req, res) => {
    try {
        // Since we don't have a bookings model yet, we'll show this as a placeholder
        // In a real app, you'd query a Bookings model
        res.render("users/my-trips.ejs");
    } catch (err) {
        req.flash("error", "Error fetching your trips");
        res.redirect("/user/profile");
    }
};
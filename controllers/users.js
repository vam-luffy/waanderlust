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

// Render Edit Profile Form
module.exports.renderEditProfileForm = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/listings");
        }
        res.render("users/edit-profile.ejs", { user });
    } catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/user/profile");
    }
};

// Update Profile
module.exports.updateProfile = async (req, res, next) => {
    console.log("Profile update started");
    
    // Set a timeout for the request
    const timeoutId = setTimeout(() => {
        if (!res.headersSent) {
            console.error("Profile update timeout - forcing redirect");
            req.flash("warning", "Update took too long, please check if your changes were saved");
            return res.redirect("/user/profile");
        }
    }, 15000); // 15 seconds timeout

    try {
        // Check if we have valid form data
        if (!req.body.user || !req.body.user.email) {
            clearTimeout(timeoutId);
            req.flash("error", "Email is required");
            return res.redirect("/user/edit");
        }
        
        console.log("Received form data:", req.body.user);
        console.log("File upload:", req.file ? "Yes" : "No");
        
        const { fullName, bio, email, phoneNumber, location } = req.body.user;
        
        // Use the direct approach to avoid any validation issues
        const result = await User.updateOne(
            { _id: req.user._id },
            {
                $set: {
                    fullName: fullName || "",
                    bio: bio || "",
                    email: email,
                    phoneNumber: phoneNumber || "",
                    location: location || "",
                    ...(req.file && {
                        profileImage: {
                            url: req.file.path,
                            filename: req.file.filename
                        }
                    })
                }
            }
        );
        
        console.log("Update result:", result);
        
        clearTimeout(timeoutId);
        req.flash("success", "Profile updated successfully!");
        console.log("Redirecting to profile page");
        
        // Force an immediate redirect without waiting
        res.writeHead(302, { 'Location': '/user/profile' });
        res.end();
    } catch (err) {
        clearTimeout(timeoutId);
        console.error("Profile update error:", err);
        req.flash("error", "Error updating profile: " + (err.message || "Unknown error"));
        
        // Force an immediate redirect without waiting
        res.writeHead(302, { 'Location': '/user/edit' });
        res.end();
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

// Wishlist Controllers
module.exports.renderWishlist = async (req, res) => {
    try {
        // Find user and populate wishlist with listing details
        const user = await User.findById(req.user._id).populate('wishlist');
        
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/listings");
        }
        
        res.render("users/wishlist.ejs", { wishlistItems: user.wishlist });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching your wishlist");
        res.redirect("/user/profile");
    }
};

module.exports.toggleWishlistItem = async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.user._id;
        
        // Verify that the listing exists
        const listingExists = await Listing.exists({ _id: listingId });
        if (!listingExists) {
            return res.status(404).json({ 
                success: false, 
                message: "Listing not found" 
            });
        }
        
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        // Check if listing is already in wishlist
        const isInWishlist = user.wishlist.includes(listingId);
        
        if (isInWishlist) {
            // Remove from wishlist
            await User.findByIdAndUpdate(userId, {
                $pull: { wishlist: listingId }
            });
            return res.json({ 
                success: true, 
                added: false, 
                message: "Removed from wishlist"
            });
        } else {
            // Add to wishlist
            await User.findByIdAndUpdate(userId, {
                $addToSet: { wishlist: listingId }
            });
            return res.json({ 
                success: true, 
                added: true, 
                message: "Added to wishlist"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error"
        });
    }
};

// Check if a listing is in the user's wishlist
module.exports.checkWishlistStatus = async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.user._id;
        
        const user = await User.findById(userId);
        const isInWishlist = user.wishlist.includes(listingId);
        
        return res.json({
            success: true,
            isInWishlist
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
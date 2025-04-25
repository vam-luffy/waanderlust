const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    // Populate all listings with their reviews to calculate ratings
    const allListings = await listing.find({}).populate("reviews");
    
    // Calculate average rating for each listing
    allListings.forEach(listing => {
        if (listing.reviews.length > 0) {
            const totalRating = listing.reviews.reduce((sum, review) => {
                return sum + (review.rating || 0);
            }, 0);
            listing.avgRating = (totalRating / listing.reviews.length).toFixed(1);
        } else {
            listing.avgRating = "New";
        }
    });
    
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"},})
    .populate("owner");
    if (!foundListing) {
        req.flash("error","listing you requested is not found");
        res.redirect("/listings");
        
    }
    console.log(foundListing)
    res.render("listings/show", { listings: foundListing });
}

module.exports.createListing = async (req, res) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 2
        }).send();

        let url = req.file.path;
        let filename = req.file.filename;
        const listingData = req.body.listing;
        
        // Debug categories
        console.log("Categories from form:", listingData.categories);
        
        // Handle empty categories array
        if (!listingData.categories) {
            listingData.categories = [];
            console.log("No categories found, setting to empty array");
        }
        
        const newListing = new listing(listingData);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();
        console.log("Saved listing categories:", savedListing.categories);
        req.flash("success", "New listing created successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Error creating listing: " + err.message);
        res.redirect("/listings/new");
    }
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);  // Use a different variable name
    if (!foundListing) {
        req.flash("error","listing you requested is not found");
        res.redirect("/listings");
        
    }
    let originalImage = foundListing.image.url;
    originalImage.replace("/uploads","/upload/w_250");
    res.render("listings/edit", { listing: foundListing, Listing: originalImage });  // Pass it as `listing` to the view
}

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body.listing };
        
        // Debug categories
        console.log("Update categories from form:", updateData.categories);
        
        // Handle empty categories array
        if (!updateData.categories) {
            updateData.categories = [];
            console.log("No categories in update, setting to empty array");
        }
        
        // Check if location has changed; if so, update coordinates
        const currentListing = await listing.findById(id);
        if (currentListing.location !== updateData.location) {
            try {
                // Get new coordinates from geocoding API
                let response = await geocodingClient.forwardGeocode({
                    query: updateData.location,
                    limit: 1
                }).send();
                
                if (response.body.features && response.body.features.length) {
                    updateData.geometry = response.body.features[0].geometry;
                }
            } catch (geocodeErr) {
                console.error("Geocoding error:", geocodeErr);
            }
        }
        
        const updatedListing = await listing.findByIdAndUpdate(id, updateData, { new: true });
        
        if (typeof req.file !== "undefined") { 
            let url = req.file.path;
            let filename = req.file.filename;
            updatedListing.image = {url, filename};
            await updatedListing.save();
        }
        
        console.log("Updated listing categories:", updatedListing.categories);
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error updating listing: " + err.message);
        res.redirect(`/listings/${req.params.id}/edit`);
    }
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");  // Redirect back to the listings index
}
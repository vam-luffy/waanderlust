const listing=require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm=(req, res) => {

    res.render("listings/new");
}

module.exports.showListing=async (req, res) => {
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

module.exports.createListing=async (req, res) => {
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send()

    let url=req.file.path;
    let filename=req.file.filename;
    const listingData = req.body.listing;
    const newListing = new listing(listingData);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry = response.body.features[0].geometry;

    let savedListing=await newListing.save();
    console.log(savedListing)
    req.flash("success","new lsiting created")
    res.redirect("/listings");
}

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);  // Use a different variable name
    if (!foundListing) {
        req.flash("error","listing you requested is not found");
        res.redirect("/listings");
        
    }
    let originalImage=foundListing.image.url;
    originalImage.replace("/uploads","/upload/w_250")
    res.render("listings/edit", { listing: foundListing,Listing:originalImage });  // Pass it as `listing` to the view
}

module.exports.updateListing=async (req, res) => {
    const { id } = req.params;
    const updatedListing = await listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if(typeof req.file!="undefined"){ 
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
    await updatedListing.save();
    }
    req.flash("success"," lisiting updated")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    const deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," lisiting deleted")
    res.redirect("/listings");  // Redirect back to the listings index
}
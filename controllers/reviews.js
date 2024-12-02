const listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async (req, res) => {
    listingsId = req.params.id;
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    // console.log(newReview)

    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success","new review created")

    console.log(newReview);
    res.redirect(`/listings/${listingsId}`);
}

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," review deleted")

    res.redirect(`/listings/${id}`);
}
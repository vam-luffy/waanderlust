const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),  // Title required hona chahiye
        description: Joi.string().required(),  // Description bhi required hona chahiye
        location: Joi.string().required(),  // Location required
        country: Joi.string().required(),  // Country bhi required
        price: Joi.number().required().min(0),  // Price number hona chahiye aur 0 se bada
        image: Joi.object({
            url: Joi.string().uri().allow("", null)  // Image URL optional aur agar empty ho toh allow kar sakte ho
        }).optional()  // Image optional hai, agar user image na de toh chalega
    })  // Listing object required hai
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),  // Rating between 1 and 5 hona chahiye
        Comment: Joi.string().required(),  // Comment required hona chahiye
    }).required()  // Review object required
})
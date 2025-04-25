const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Import Schema correctly from mongoose
const { Schema } = mongoose;  // Add this line to import Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // Add profile image and personal details
    profileImage: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/djh4n5s5z/image/upload/v1618408161/user-default_pnxoyk.png"
        },
        filename: String
    },
    fullName: String,
    bio: String,
    location: String,
    phoneNumber: String,
    joinedAt: {
        type: Date,
        default: Date.now
    },
    // Wishlist - array of listing IDs the user has saved
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Listing'
        }
    ]
});

// Add passport-local-mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model("User", userSchema);

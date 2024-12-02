const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Import Schema correctly from mongoose
const { Schema } = mongoose;  // Add this line to import Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Add passport-local-mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model("User", userSchema);

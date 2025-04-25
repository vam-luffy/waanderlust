// Load environment variables if not already loaded
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Make sure we have the required configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary configuration!");
    console.error("CLOUDINARY_CLOUD_NAME:", cloudName);
    console.error("CLOUDINARY_API_KEY:", apiKey ? "Set" : "Missing");
    console.error("CLOUDINARY_API_SECRET:", apiSecret ? "Set" : "Missing");
}

// Configure cloudinary
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey, 
    api_secret: apiSecret
});

// Set up storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});

// Export the configured objects
module.exports = {
    cloudinary,
    storage
}; 
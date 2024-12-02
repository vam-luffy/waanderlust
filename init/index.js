const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js"); // Adjust the path according to your project structure

// Error detection in the database
main()
    .then(() => {
        console.log("Connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

// Connection to db and creating a db
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    });
}

// Initialize database
const initDB = async () => {
    await Listing.deleteMany({});
    // Correctly modify the array with owner
    const updatedData = initData.data.map((obj) => ({ ...obj, owner: "6741de2c037122b6a592fa4c" }));
    await Listing.insertMany(updatedData); // Use the updated array
    console.log("Data was initialized");
};

// Call initDB after establishing connection
main().then(initDB);

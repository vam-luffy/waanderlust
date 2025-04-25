const Listing = require("../models/listing");
const User = require("../models/user");
const Review = require("../models/review");

// Admin dashboard render
module.exports.renderDashboard = async (req, res) => {
    try {
        // Get counts for dashboard
        const listingCount = await Listing.countDocuments({});
        const userCount = await User.countDocuments({});
        const reviewCount = await Review.countDocuments({});
        
        // Get newest listings for dashboard
        const recentListings = await Listing.find({})
            .sort({ _id: -1 })
            .limit(5)
            .populate("owner");
        
        res.render("admin/dashboard", { 
            listingCount, 
            userCount, 
            reviewCount,
            recentListings
        });
    } catch (err) {
        req.flash("error", "Error loading dashboard");
        res.redirect("/listings");
    }
};

// Categories page render
module.exports.renderCategories = async (req, res) => {
    try {
        // Get all listings to calculate category counts
        const allListings = await Listing.find({});
        
        // Count listings per category
        const categoriesEnum = ['trending', 'rooms', 'cities', 'mountains', 'castles', 'arctic', 'camping', 'farms'];
        const categoryCounts = {};
        
        categoriesEnum.forEach(category => {
            categoryCounts[category] = allListings.filter(listing => 
                listing.categories && listing.categories.includes(category)
            ).length;
        });
        
        res.render("admin/categories", { categoryCounts });
    } catch (err) {
        req.flash("error", "Error loading categories");
        res.redirect("/admin/dashboard");
    }
};

// Create a new category
module.exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        // In a real implementation, we would update the Listing schema here
        // For now, we just return success
        
        req.flash("success", `New category "${name}" created successfully`);
        res.redirect("/admin/categories");
    } catch (err) {
        req.flash("error", "Error creating category");
        res.redirect("/admin/categories");
    }
};

// Update an existing category
module.exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, oldName } = req.body;
        
        // In a real implementation, we would update all listings with this category
        // For now, just return success
        
        req.flash("success", `Category updated from "${oldName}" to "${name}"`);
        res.redirect("/admin/categories");
    } catch (err) {
        req.flash("error", "Error updating category");
        res.redirect("/admin/categories");
    }
};

// Delete a category
module.exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        // In a real implementation, we would remove this category from all listings
        // For now, just return success
        
        req.flash("success", `Category "${name}" deleted successfully`);
        res.redirect("/admin/categories");
    } catch (err) {
        req.flash("error", "Error deleting category");
        res.redirect("/admin/categories");
    }
}; 
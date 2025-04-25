const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isloggedIn, isAdmin } = require("../middleware.js");
const adminController = require("../controllers/admin.js");

// Dashboard route
router.get("/dashboard", isloggedIn, isAdmin, wrapAsync(adminController.renderDashboard));

// Category management routes
router.get("/categories", isloggedIn, isAdmin, wrapAsync(adminController.renderCategories));
router.post("/categories", isloggedIn, isAdmin, wrapAsync(adminController.createCategory));
router.put("/categories/:id", isloggedIn, isAdmin, wrapAsync(adminController.updateCategory));
router.delete("/categories/:id", isloggedIn, isAdmin, wrapAsync(adminController.deleteCategory));

module.exports = router; 
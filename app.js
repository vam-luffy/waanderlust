if (process.env.NODE_ENV != "production") {
    require('dotenv').config(); // Load environment variables in non-production environment
  }
  
  const express = require("express");
  const mongoose = require("mongoose");
  const path = require("path");
  const ejsMate = require('ejs-mate');
  const ExpressError = require("./utils/ExpressError");
  const listingRouter = require("./routes/listing.js");
  const reviewRouter = require("./routes/review.js");
  const session = require("express-session");
  const Mongostore=require("connect-mongo")
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const User = require("./models/user.js");
  const userRouter = require("./routes/user.js");
  const adminRouter = require("./routes/admin.js");
  
  const app = express();
  const port = 8080;
  const dbUrl = process.env.ATLASDB_URL;
  const localDbUrl = 'mongodb://localhost:27017/wanderlust';
  const methodOverride = require("method-override");
  
  // Set up view engine to use EJS and ejsMate for layout support
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.engine('ejs', ejsMate);
  
  // Middleware for parsing URL-encoded data and JSON requests
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(methodOverride("_method")); // Enable method override for PUT/DELETE requests in forms
  
  // Serve static files like images, CSS, etc., from the 'public' folder
  app.use(express.static(path.join(__dirname, "/public")));

  const store=Mongostore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET  // Secret for session encryption

    },
    touchAfter:24*3600,
  });
  
  store.on("error",()=>{
    console.log(err)
  })

  // Session configuration
  const sessionOptions = {
    store,
    secret: process.env.SECRET,  // Secret for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // Cookie expires in 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000, // Maximum age of the cookie
      httpOnly: true,  // Ensure the cookie is sent only over HTTP(S)
    }
  };



  // Middleware for session, flash messages, and Passport
  app.use(session(sessionOptions));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  // Middleware to add flash messages and current user info to locals
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user || null;
    next(); // Proceed to the next middleware/route handler
  });

  
  app.get("/", (req, res) => {
    res.redirect("/listings");
  });
  
  
  // Demo route for user registration
  app.get("/demouser", async (req, res) => {
    const fakeUser = new User({ email: "student@gmail.com", username: "vamsh" });
    const registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
  });

  // Demo route to create an admin user
  app.get("/create-admin", async (req, res) => {
    try {
      const adminUser = new User({ 
        email: "admin@wanderlust.com", 
        username: "admin", 
        isAdmin: true 
      });
      const registeredUser = await User.register(adminUser, "adminpass");
      res.send("Admin created: " + registeredUser.username);
    } catch (err) {
      res.send("Error creating admin: " + err.message);
    }
  });
  
  // Routes for managing listings and reviews
  app.use("/listings", listingRouter);  // Route for listings
  app.use("/listings/:id/reviews/", reviewRouter);  // Route for reviews for a specific listing
  app.use("/", userRouter);  // User-related routes (e.g., login, register)
  app.use("/admin", adminRouter);  // Admin routes
  
  
  
  // MongoDB connection function
  async function main() {
    try {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: false
      }); // Connect to MongoDB Atlas
      console.log("Connected to MongoDB Atlas");
    } catch (atlasErr) {
      console.log("Atlas connection error, trying local MongoDB:", atlasErr);
      try {
        await mongoose.connect(localDbUrl);
        console.log("Connected to local MongoDB");
      } catch (localErr) {
        console.log("Local database connection error:", localErr);
      }
    }
  }
  
  // Call the connection function
  main();
  
  // Catch-all route for unmatched routes (404 error)
  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
  });
  
  // Global error handling middleware
  app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { message });
  });
  
  // Start the server and listen on the specified port
  app.listen(port, () => {
    console.log(`App is listening on localhost:${port}`);
  });
  
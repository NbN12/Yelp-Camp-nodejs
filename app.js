var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  seedDB = require("./seed"),
  //=================================================
  // ROUTES
  indexRoutes = require("./routes/index"),
  commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds");

if (process.env.DATA_BASE !== null) {
  mongoose.connect(process.env.DATA_BASE);
} else {
  mongoose.connect("mongodb://localhost/yelp_camp_v4");
}

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Ruzty wins cutest dog!!!",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get("*", function(req, res) {
  res.send("404 Not Found");
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("The Yelp Camp Server has started!!");
});

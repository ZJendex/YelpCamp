/**
 author: ZJendex
 Date: 7/29/2020
 Location: Amherst MA
 **/
let express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");
    User = require("./models/user"),
    seedDB = require("./seeds");

let commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

app.set("view engine", "ejs");
//telling ejs to use the "public" package
app.use(express.static("public"));
//to change the req.body to a js type
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
//flash use should before the passport initialization
app.use(flash());
//in order to use passport.session
app.use(require("express-session")({
    secret: "The secret to encode and decode the session",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session(undefined));



//let all the views have the variable currentUser
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.messageError = req.flash("error");
    res.locals.messageSuccess = req.flash("success");
    next();
});

//Enable to check if the username paired with the password
passport.use(new localStrategy(User.authenticate()));
//handling hashing the password
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//make database address environment variable so that when deploying, we can change this variable to access different database
process.env.DATABASEURL = "mongodb://localhost:27017/yelp_camp_4";
//connect/initialized the database  --adding options to avoid the errors
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect("mongodb+srv://User1:111@clusterzj.wy4kz.mongodb.net/test?authSource=admin&replicaSet=atlas-pkmg0g-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true", {useNewUrlParser: true, useUnifiedTopology: true});

//seedDB();

app.use(indexRoutes);
//append "/campgrounds" to the front of each **router** request
app.use("/campgrounds", campgroundRoutes);
app.use("/campGrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function () {
    console.log("YelpCamp Started!!")
});

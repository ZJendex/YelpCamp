/**
 author: ZJendex
 Date: 8/11/2020
 Location: Amherst MA
 **/
let express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


router.get("/",function (req, res) {
    res.render("landing");
});

router.get("/register", function (req, res) {
    res.render("register")
});

router.post("/register", function (req, res) {
    let newUser = new User ({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register")
        }
        //log user in in local
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            //not case sensitive on the url
            res.redirect("/campgrounds")
        })
    });
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function (req, res) {

});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "log out successfully");
    res.redirect("/campgrounds");
});

module.exports = router;


/**
 author: ZJendex
 Date: 8/11/2020
 Location: Amherst MA
 **/
let express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/index");

//INDEX - show all campgrounds
router.get("/",function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if(err){
            console.log("ERROR GETTING THE CAMPGROUNDS DATA!!");
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn,function (req, res) {
    Campground.create(req.body.campground, function(err, newlyCreatedCampground){
        if(err){
            console.log("FAILED TO CREATE A NEW CAMPGROUND!", err);
        }else{
            newlyCreatedCampground.author.id = req.user._id;
            newlyCreatedCampground.author.username = req.user.username;
            newlyCreatedCampground.save();
            res.redirect("/campGrounds");
        }
    })
});
//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req, res){
    res.render("campgrounds/new");
});
// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "Cannot find the Campground");
            res.redirect("back");
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
// EDIT - edit one campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            res.render("campgrounds/edit", {campground: foundCampground});
        })
});
// UPDATE - update the campground
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if(err){
            res.redirect("/campgrounds")
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});
// DESTROY - delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, deletedCampground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        } else{
            //delete all the comments
            for(let comment of deletedCampground.comments){
                Comment.findByIdAndRemove(comment, function (err, deletedComment) {
                    if(err){
                        console.log(err);
                    }
                });
            }
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
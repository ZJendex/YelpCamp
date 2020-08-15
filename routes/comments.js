/**
 author: ZJendex
 Date: 8/11/2020
 Location: Amherst MA
 **/
let express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/index");

router.get("/new", middleware.isLoggedIn,function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});
//adding isLoggedIn to avoid if someone use postman to make a post request directly the url
router.post("/", middleware.isLoggedIn,function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            Comment.create(req.body.comment, function (err, comment) {
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campGrounds/" + foundCampground._id);
                }
            })
        }
    })
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    res.render("comments/edit", {campground: foundCampground, comment: foundComment});
                }
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err, deletedComment) {
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});


module.exports = router;
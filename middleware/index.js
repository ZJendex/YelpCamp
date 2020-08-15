/**
 author: ZJendex
 Date: 8/11/2020
 Location: Amherst MA
 **/
let Campground = require("../models/campground"),
    Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //before redirection, giving the accessibility of using flash in next request
    req.flash("error", "Please log in first！！");
    res.redirect("/login")
};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function (err, foundCampground) {
            if(err || !foundCampground){
                req.flash("error", "Cannot find the Campground");
                res.redirect("back");
            }else{
                //foundCampground.author.id is an **mongoose object**
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                }else{
                    req.flash("error", "Only the owner can make change on this");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Only the owner can make change on this");
        //back to where u come from
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if(err || !foundComment){
                req.flash("error", "Cannot find the Comment");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Only the owner can make change on this");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "Only the owner can make change on this");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
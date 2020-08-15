/**
 author: ZJendex
 Date: 8/10/2020
 Location: Amherst MA
 **/
let mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

//set up schema
let UserSchema = new mongoose.Schema({
    username: String,
    passport: String
});
//use passportlocalMongoose
UserSchema.plugin(passportLocalMongoose);
//connect to the module
module.exports = mongoose.model("User", UserSchema);
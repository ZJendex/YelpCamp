/**
 author: ZJendex
 Date: 8/4/2020
 Location: Amherst MA
 **/
let mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);
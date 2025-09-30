const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true],
        
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
    },
    group: {
        type: mongoose.Types.ObjectId,
        ref: "group",
    },
});

CommentSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "firstName lastName",
    });
    next();
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

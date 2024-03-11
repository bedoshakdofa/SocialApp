const CatchAsync = require("../utils/CatchAsync");
const Comment = require("../models/commentModel");
const AppError = require("./../utils/AppError");
const Factory = require("./../Controllers/handlerFactory");
const Post = require("../models/PostModel");

exports.CreateComment = CatchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (post.group) {
        if (!req.user.group.includes(post.group))
            return next(new AppError(401, "you are not authraized"));
    }
    const comment = await Comment.create({
        content: req.body.content,
        user: req.user.id,
        group: post.group,
        post: req.params.postId,
    });
    res.status(202).json({
        status: "success",
        data: {
            comment,
        },
    });
});

exports.DeleteComment = CatchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);
    //check if the currant user is his post
    if (comment.user._id != req.user.id)
        return next(new AppError(401, "your are not have permission"));

    comment.deleteOne();

    res.status(204).json({
        status: "success",
    });
});
exports.updateComment = Factory.UpdateOne(Comment);

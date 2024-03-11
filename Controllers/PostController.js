const Post = require("./../models/PostModel");
const Comment = require("./../models/commentModel");
const CatchAsync = require("./../utils/CatchAsync");
const Factory = require("./../Controllers/handlerFactory");
const AppError = require("./../utils/AppError");

exports.setCreatePost = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    next();
};
exports.CreatePost = Factory.createOne(Post);
exports.DeletePost = CatchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) return next(new AppError(404, "the post has been deleted"));

    if (post.user._id != req.user.id)
        return next(new AppError(401, "your are not have permission"));

    await Comment.deleteMany({ post: post.id });
    post.deleteOne();

    res.status(204).json({
        status: "success",
    });
});
exports.UpdatePost = Factory.UpdateOne(Post);
exports.GetAllPost = Factory.GetAll(Post, { group: null });
exports.GetOnePost = CatchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate("comments");

    if (!post) return next(new AppError(404, "the post is not found"));

    res.status(200).json({
        status: "success",
        data: {
            post,
        },
    });
});

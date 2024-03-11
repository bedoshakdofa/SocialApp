const express = require("express");
const Router = express.Router();
const PostController = require("./../Controllers/PostController");
const CommentRouter = require("./CommentRoutes");
const groupRouter = require("./../Routers/groupRoutes");
const Middleware = require("./../Controllers/Middelware");

Router.use("/:postId/comment", CommentRouter);
Router.use(Middleware.protect);

Router.route("/")
    .post(PostController.setCreatePost, PostController.CreatePost)
    .get(PostController.GetAllPost);
Router.route("/:id")
    .delete(PostController.DeletePost)
    .patch(PostController.UpdatePost)
    .get(PostController.GetOnePost);
module.exports = Router;

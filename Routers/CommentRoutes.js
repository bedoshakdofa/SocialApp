const express = require("express");
const Router = express.Router({ mergeParams: true });
const ComntController = require("../Controllers/CommentController");
const Middelware = require("./../Controllers/Middelware");

Router.use(Middelware.protect);
Router.route("/").post(ComntController.CreateComment);
Router.route("/:id")
    .delete(ComntController.DeleteComment)
    .patch(ComntController.updateComment);
module.exports = Router;

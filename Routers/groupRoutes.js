const express = require("express");
const Router = express.Router({ mergeParams: true });
const GroupController = require("./../Controllers/GroupController");
const middelware = require("./../Controllers/Middelware");

Router.use(middelware.protect);
Router.post(
    "/create",
    GroupController.setCreateGroup,
    GroupController.createGroup
);
Router.patch("/join/:groupId", GroupController.joinGroup);
Router.patch("/leave/:groupId", GroupController.leaveGroup);
Router.route("/:groupId")
    .post(GroupController.CreateGroupPost)
    .get(GroupController.getAllGroupPost);
module.exports = Router;

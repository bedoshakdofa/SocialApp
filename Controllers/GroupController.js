const CatchAsync = require("./../utils/CatchAsync");
const group = require("../models/groupModel");
const Post = require("./../models/PostModel");
const User = require("./../models/UserModel");
const Factory = require("./../Controllers/handlerFactory");
const AppError = require("./../utils/AppError");

exports.setCreateGroup = (req, res, next) => {
    if (!req.body.groupAdmin) req.body.groupAdmin = req.user.id;
    req.body.user = req.user.id;
    next();
};

exports.createGroup = Factory.createOne(group);
exports.getAllGroupPost = Factory.GetAll(Post);

exports.joinGroup = CatchAsync(async (req, res, next) => {
    const updatedgroup = await group.findById(req.params.groupId);
    const user = await User.findById(req.user.id);
    if (
        updatedgroup.user.includes(req.user.id) ||
        user.group.includes(req.params.groupId)
    ) {
        return next(new AppError(403, "you are in the group"));
    }
    updatedgroup.user.push(req.user.id);
    user.group.push(req.params.groupId);
    await updatedgroup.save();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: "success",
        data: {
            group: updatedgroup,
        },
    });
});

exports.leaveGroup = CatchAsync(async (req, res, next) => {
    const updatedgroup = await group.findById(req.params.groupId);
    const user = await User.findById(req.user.id);
    if (
        !updatedgroup.user.includes(req.user.id) ||
        !user.group.includes(req.params.groupId)
    ) {
        return next(new AppError(403, "you already left your group"));
    }
    updatedgroup.user.pull(req.user.id);
    user.group.pull(req.params.groupId);
    await updatedgroup.save();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: "success",
        data: {
            group: updatedgroup,
        },
    });
});
exports.CreateGroupPost = CatchAsync(async (req, res, next) => {
    const Group = await group.findById(req.params.groupId);
    if (!Group.user.includes(req.user.id))
        return next(
            new AppError(404, "you not have permission to post in this group")
        );
    const post = await Post.create({
        user: req.user.id,
        group: req.params.groupId,
    });
    res.status(202).json({
        status: "success",
        data: {
            post,
        },
    });
});
exports.searchGroup = CatchAsync(async (req, res, next) => {
    let query;
    if (req.query.search) {
        query = { groupName: { $regex: req.query.search, $options: "i" } };
    }
    const groups = await group.find(query);
    if (groups)
        return next(new AppError(404, "there is no group with is name"));

    res.status(200).json({
        status: "success",
        data: {
            groups,
        },
    });
});

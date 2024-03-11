const CatchAsync = require("./../utils/CatchAsync");
const AppError = require("./../utils/AppError");
exports.createOne = (Model) => {
    return CatchAsync(async (req, res, next) => {
        const Doc = await Model.create(req.body);
        res.status(200).json({
            status: "success",
            data: {
                Doc,
            },
        });
    });
};

exports.UpdateOne = (Model) => {
    return CatchAsync(async (req, res, next) => {
        const Doc = await Model.findById(req.params.id);
        //check if the currant user is his post
        if (Doc.user._id != req.user.id)
            return next(new AppError(401, "your are not have permission"));

        Doc.content = req.body.content;
        await Doc.save();

        res.status(200).json({
            status: "success",
            data: {
                Doc,
            },
        });
    });
};

exports.GetAll = (Model, Option) => {
    return CatchAsync(async (req, res, next) => {
        const Doc = await Model.find(Option || { group: req.params.groupId });
        res.status(200).json({
            status: "success",
            data: {
                posts: Doc,
            },
        });
    });
};

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        group: {
            type: mongoose.Types.ObjectId,
            ref: "group",
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
    { timestamps: true }
);

PostSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "post",
    localField: "_id",
});

PostSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "firstName lastName",
    });
    next();
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;

const mongoose = require("mongoose");
const groupSchmea = mongoose.Schema({
    groupName: {
        type: String,
        maxlength: 30,
        minlength: 5,
        required: true,
        tirm: true,
    },
    user: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    groupAdmin: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
});

const group = mongoose.model("group", groupSchmea);

module.exports = group;

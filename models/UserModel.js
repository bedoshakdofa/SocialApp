const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        tirm: true,
        maxlength: 20,
        minlength: 1,
        required: [true, "please enter your first name"],
    },
    lastName: {
        type: String,
        tirm: true,
        maxlength: 20,
        minlength: 1,
        required: [true, "please enter your last name"],
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    photo: {
        type: String,
        default: "default.jpg",
    },
    links: {
        type: String,
        tirm: true,
    },
    email: {
        type: String,
        validate: [validator.isEmail, "please enter a proper form of email"],
        unique: true,
        tirm: true,
        lowercase: true,
        required: [true, "please enter your email"],
    },
    active: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, "please enter a password"],
        minlength: [8, "password must be 8 charcter"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "please renter your password"],
        validate: {
            validator: function (el) {
                return this.password === el;
            },
            message: "password you entered are not the same",
        },
    },
    passwordChangeAt: {
        type: Date,
        select: false,
    },
    group: [
        {
            type: mongoose.Types.ObjectId,
            ref: "group",
        },
    ],
    Token: String,
    TokenExp: String,
    OTP: String,
    OTPExp: Date,
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});
UserSchema.pre(/^find/, function (next) {
    //check if the query have active property with false
    if (this._conditions.active == false) return next();
    this.find({ active: true });
    next();
});
UserSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangeAt = Date.now() - 6000;
    next();
});

UserSchema.methods.CheckPassword = async function (enterdPass, password) {
    return await bcrypt.compare(enterdPass, password);
};

UserSchema.methods.ispasswordChanged = function (JWTtimeStamp) {
    if (this.passwordChangeAt) {
        const timeStamp = parent(this.passwordChangeAt.getTime() / 1000, 10);
        return timeStamp > JWTtimeStamp;
    }
    return false;
};
UserSchema.methods.CreatePasswordRestToken = function () {
    const restToken = crypto.randomBytes(32).toString("hex");
    this.Token = crypto.createHash("sha256").update(restToken).digest("hex");
    this.TokenExp = Date.now() + 10 * 60 * 1000;

    return restToken;
};

UserSchema.methods.generateOTP = function () {
    const otp = crypto.randomInt(100000, 999999);
    this.OTP = otp;
    this.OTPExp = Date.now() + 10 * 60 * 1000;
    return otp;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;

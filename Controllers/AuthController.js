const jwt = require("jsonwebtoken");
const multer = require("multer");
const CatchAsync = require("./../utils/CatchAsync");
const AppError = require("./../utils/AppError");
const User = require("./../models/UserModel");
const crypto = require("crypto");
const SendEmail = require("./../utils/sendEmail");

const multerStorge = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError(400, "wrong extension only image"), false);
    }
};

const upload = multer({
    storage: multerStorge,
    fileFilter: multerFilter,
});

exports.UploadUserPhoto = upload.single("photo");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "90d",
    });
};
exports.Signup = CatchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const Token = newUser.CreatePasswordRestToken();

    await newUser.save({ validateBeforeSave: false });

    const URL = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/users/verfiyemail/${Token}`;

    try {
        await new SendEmail(URL, newUser).Send(
            "verfiy your account",
            "emailverfiy"
        );
        res.status(201).json({
            status: "success",
            message: "please check your email to verfiy your email",
        });
    } catch (err) {
        newUser.Token = undefined;
        newUser.TokenExp = undefined;
        await newUser.save({ validateBeforeSave: false });
        return next(
            new AppError(500, "somthing went wrong please try again!!!")
        );
    }
});

exports.verfiyEmail = CatchAsync(async (req, res, next) => {
    const token = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const currantuser = await User.findOne({ active: false, Token: token });

    currantuser.Token = undefined;
    currantuser.TokenExp = undefined;
    currantuser.active = true;
    await currantuser.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "email verfied ✅",
    });
});

exports.login = CatchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError(404, "please enter your email and password"));
    }
    const currantuser = await User.findOne({ email }).select("+password");

    if (
        !currantuser ||
        !(await currantuser.CheckPassword(password, currantuser.password))
    ) {
        return next(new AppError(401, "invaild email or password"));
    }
    const token = signToken(currantuser._id);
    res.status(200).json({
        status: "success",
        token,
        data: {
            currantuser,
        },
    });
});

exports.UpdatePassword = CatchAsync(async (req, res, next) => {
    const { currantPass, newPass, passwordConfirm } = req.body;

    const currantUser = await User.findById(req.user.id).select("+password");

    if (!(await currantUser.CheckPassword(currantPass, currantUser.password)))
        return next(new AppError(401, "invaild enterd password"));

    currantUser.password = newPass;
    currantUser.passwordConfirm = passwordConfirm;
    currantUser.save();

    const token = signToken(currantUser.id);
    res.status(200).json({
        status: "success",
        token,
    });
});

exports.forgetpassword = CatchAsync(async (req, res, next) => {
    const currantuser = await User.findOne({ email: req.body.email });

    if (!currantuser)
        return next(new AppError(404, "no username with is this email "));

    RestToken = currantuser.CreatePasswordRestToken();

    await currantuser.save({ validateBeforeSave: false });

    const restURL = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/users/restpassword`;

    const message = `Forgot your password? 
    Submit a PATCH request with your new password and passwordConfirm to: ${restURL}.
    \nIf you didn't forget your password, please ignore this email!`;

    try {
        await SendEmail({
            email: req.body.email,
            subject: "password rest email (vaild for 10 min)",
            message,
        });
        res.status(200).json({
            status: "success",
        });
    } catch (err) {
        currantuser.Token = undefined;
        currantuser.TokenExp = undefined;
        await currantuser.save({ validateBeforeSave: false });

        return next(
            new AppError(
                500,
                "there is error is sending email please try again!!!!"
            )
        );
    }
});

exports.restpassword = CatchAsync(async (req, res, next) => {
    const token = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const currantuser = await User.findOne({
        Token: token,
        TokenExp: { $gt: Date.now() },
    });
    if (!currantuser)
        return next(new AppError(403, "your token has been exprired"));

    currantuser.password = req.body.password;
    currantuser.passwordConfirm = req.body.passwordConfirm;
    currantuser.TokenExp = undefined;
    currantuser.Token = undefined;
    await currantuser.save();

    res.status(200).json({
        status: "sucess",
    });
});

exports.UpdateMe = CatchAsync(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.filename;
    const UpdateUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "sucess",
        data: {
            user: UpdateUser,
        },
    });
});

exports.Me = CatchAsync(async (req, res, next) => {
    const currantuser = await User.findById(req.user.id);
    res.status(200).json({
        status: "sucess",
        data: {
            user: currantuser,
        },
    });
});

exports.deleteMe = CatchAsync(async (req, res, next) => {
    const { password } = req.body;
    const currantuser = await User.findById(req.user.id).select("+password");
    if (!(await currantuser.CheckPassword(password, currantuser.password)))
        return next(new AppError(401, "please enterd your password"));

    currantuser.deleteOne();

    res.status(200).json({
        status: "success",
        message: "your account has been deleted",
    });
});

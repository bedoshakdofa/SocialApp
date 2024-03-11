const CatchAsync = require("./../utils/CatchAsync");
const AppError = require("./../utils/AppError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/UserModel");

exports.protect = CatchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError(401, "your are not logged in "));
    }

    const decode = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET_KEY
    );

    const currantuser = await User.findById(decode.id);
    if (!currantuser) {
        return next(new AppError(404, "invaild email or password"));
    }

    if (currantuser.ispasswordChanged(decode.iat)) {
        return next(new AppError(403, "please login again "));
    }

    req.user = currantuser;
    next();
});

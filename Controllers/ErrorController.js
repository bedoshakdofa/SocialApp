const AppError = require("./../utils/AppError");

const HandleJwtError = () => {
    return new AppError(404, "your are not logged in please log in");
};

const HandleDuplicate = (err) => {
    const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/);
    return new AppError(404, `duplicate value at ${value}`);
};

const HandleValidationError = (err) => {
    const msg = Object.values(err.errors).map((el) => el.message);
    return new AppError(422, `${msg}`);
};
const Errorprod = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "something went wrong ",
        });
    }
};

const ErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

exports.Error = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        ErrorDev(res, err);
    } else if (process.env.NODE_ENV === "production") {
        if (err.name === "JsonWebTokenError") err = HandleJwtError(err);
        if (err.name === "ValidationError") err = HandleValidationError(err);
        if (err.code === 11000) err = HandleDuplicate(err);

        Errorprod(err, res);
    }
};

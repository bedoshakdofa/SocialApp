const express = require("express");
const morgan = require("morgan");
const path = require("path");
const AppError = require("./utils/AppError");
const AuthRouter = require("./Routers/UserRoutes");
const PostRouter = require("./Routers/PostRoutes");
const CommentRouter = require("./Routers/CommentRoutes");
const GroupRouter = require("./Routers/groupRoutes");
const ErrorController = require("./Controllers/ErrorController");

//app
const app = express();
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.set(express.static(path.join(__dirname, "public")));
//body parser
app.use(express.json());

//routers
app.use("/api/v1/users", AuthRouter);
app.use("/api/v1/post", PostRouter);
app.use("/api/v1/comment", CommentRouter);
app.use("/api/v1/group", GroupRouter);
app.all("*", (req, res, next) => {
    return next(new AppError(404, `this url ${req.originalUrl} is not found`));
});

app.use(ErrorController.Error);
module.exports = app;

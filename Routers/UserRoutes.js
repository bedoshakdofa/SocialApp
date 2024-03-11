const express = require("express");
const AuthController = require("./../Controllers/AuthController");
const Middelware = require("./../Controllers/Middelware");
const Router = express.Router();

Router.post("/signup", AuthController.Signup);
Router.patch("/verfiyemail/:token", AuthController.verfiyEmail);
Router.post("/login", AuthController.login);
Router.post("/forgetpassword", AuthController.forgetpassword);
Router.patch("/restpassword/:token", AuthController.restpassword);
Router.use(Middelware.protect);
Router.post("/updatePass", AuthController.UpdatePassword);
Router.patch(
    "/updateMe",
    AuthController.UploadUserPhoto,
    AuthController.UpdateMe
);
Router.get("/Me", AuthController.Me);
Router.delete("/deleteMe", AuthController.deleteMe);
module.exports = Router;

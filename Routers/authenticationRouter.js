const express = require("express");
const { body, query, param, check } = require("express-validator");
const router = express.Router();
const isAuthenticated = require("./../Middlewares/authenticationMw.js")

const authcontroller = require("./../Controllers/authenticationController.js")
router.post("/login", [
    body("userName").isAlphanumeric().withMessage("user name should be string"),
    body("password").isAlphanumeric().withMessage("user password shoud be any char"),
    body("email").isEmail().withMessage("user mail : valid email")
], authcontroller.authenticateUser);

router.post("/register", [
    body("isSpeaker").isBoolean().withMessage("isSpeaker : boolean"),
    body("userName").isAlphanumeric().withMessage("user name : string"),
    body("password").isAlphanumeric().withMessage("user password : any char"),
    body("passwordConfirm").isAlphanumeric().custom(async (passwordConfirm, { req }) => {
        const password = req.body.password;
        if (password !== passwordConfirm) {
            return false
        }
    }).withMessage("confirm password: must be same as password"),
    body("email").isEmail().withMessage("user mail : valid email"),
    body("address").if(body("isSpeaker").equals(true)).bail().isObject().withMessage("user address : obj"),
    body("role").if(body("isSpeaker").equals(true)).bail().isString().withMessage("role : boolean"),
    body("image").if(body("isSpeaker").equals(true)).bail().isString().withMessage("user image : string")
], authcontroller.createUser);

router.post("/changePassword", [
    // body("isSpeaker").isBoolean().withMessage("isSpeaker : boolean"),
    body("password").isAlphanumeric().withMessage("user password : any char"),
    body("newPassword").isAlphanumeric().withMessage("user password : any char"),
    body("email").isEmail().withMessage("user mail : valid email"),
], isAuthenticated, authcontroller.changePassword);



module.exports = router;
const express = require("express");
const { body, query, param, check } = require("express-validator");
const router = express.Router();
const isAuthenticated = require("./../Middlewares/authenticationMw.js");
const isAuthorized = require("../Middlewares/authorizationMw.js")

const controller = require("./../Controllers/speakersController.js");
router.route("/speakers")
    .get(isAuthenticated, isAuthorized.isSpeaker, controller.getAllSpeakers)
    .post([
        body("userName").isAlphanumeric().withMessage("user name : string"),
        body("password").isAlphanumeric().withMessage("user password : any char"),
        body("passwordConfirm").isAlphanumeric().withMessage("user password : any char"),
        body("email").isEmail().withMessage("user mail : valid email"),
        body("address").isObject().withMessage("user address : obj"),
        body("role").isString().withMessage("role : boolean"),
        body("image").isString().withMessage("user image : string")
    ], isAuthenticated, isAuthorized.isSpeaker, controller.addSpeaker)
    .put([
        body("userName").isAlphanumeric().withMessage("user name : string"),
        body("password").isAlphanumeric().withMessage("user password : any char"),
        body("email").isEmail().withMessage("user mail : valid email"),
        body("address").isObject().withMessage("user address : obj"),
        body("role").isString().withMessage("role : boolean"),
        body("image").isString().withMessage("user image : string")
    ], isAuthenticated, isAuthorized.isSpeaker, isAuthorized.isThisSpeaker, controller.updateSpeaker)
    .delete(isAuthenticated, isAuthorized.isSpeaker, isAuthorized.isThisSpeaker, controller.deleteSpeaker);;

router.route("/speakers/:id?")
    .get(isAuthenticated, isAuthorized.isSpeaker, isAuthorized.isThisSpeaker, controller.getSpeakerById);
module.exports = router;
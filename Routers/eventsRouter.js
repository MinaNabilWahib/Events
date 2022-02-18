const express = require("express");
const { body, query, param, check } = require("express-validator");
const router = express.Router();
const isAuthenticated = require("./../Middlewares/authenticationMw.js");
const isAuthorized = require("../Middlewares/authorizationMw.js")


const controller = require("./../Controllers/eventsController.js");
router.route("/events")
    .get(isAuthenticated, controller.getAllEvents)
    .post([
        body("title").isString().withMessage("title : string"),
        body("eventDate").isDate().withMessage("date : date"),
        body("mainSpeaker").isString().withMessage("mainspeaker : string"),
        body("speakers").isArray().withMessage("speakers : array"),
        body("students").isArray().withMessage("students : array")
    ], isAuthenticated, isAuthorized.isAdmin, controller.addEvent)
    .put([
        body("title").isString().withMessage("title : string"),
        body("eventDate").isDate().withMessage("date : date"),
        body("mainSpeaker").isNumeric().withMessage("mainspeaker : number"),
        body("speakers").isArray().withMessage("speakers : array"),
        body("students").isArray().withMessage("students : array")
    ], isAuthenticated, isAuthorized.isAdmin, controller.updateEvent)
    .delete(isAuthenticated, isAuthorized.isAdmin, controller.deleteEvent);

router.route("/events/:id")
    .get(isAuthenticated, controller.getEventById);
module.exports = router;
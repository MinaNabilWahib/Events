const express = require("express");
const { body, query, param, check } = require("express-validator");
const router = express.Router();
const isAuthenticated = require("./../Middlewares/authenticationMw.js");
const isAuthorized = require("../Middlewares/authorizationMw.js");

const controller = require("./../Controllers/studentsController.js");
router.route("/students")
    .get(isAuthenticated, isAuthorized.isStudent, controller.getAllStudents)
    .post([
        body("userName").isAlphanumeric().withMessage("user name shoud be string"),
        body("password").isAlphanumeric().withMessage("password should be any char"),
        body("email").isEmail().withMessage("email should be a valid email")
    ], isAuthenticated, isAuthorized.isStudent, isAuthorized.isThisStudent, controller.addStudent)
    .put([
        body("userName").isAlphanumeric().withMessage("user name shoud be string"),
        body("password").isAlphanumeric().withMessage("password should be any char"),
        body("email").isEmail().withMessage("email should be a valid email")
    ], isAuthenticated, isAuthorized.isStudent, isAuthorized.isThisStudent, controller.updateStudent)
    .delete(isAuthenticated, isAuthorized.isStudent, isAuthorized.isThisStudent, controller.deleteStudent);
router.get("/students/:id", isAuthenticated, isAuthorized.isStudent, isAuthorized.isThisStudent, controller.getStudentById);


module.exports = router;
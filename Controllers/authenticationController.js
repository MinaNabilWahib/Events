const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const mongoose = require("mongoose");



const speakerController = require("./../Controllers/speakersController.js");
const studentController = require("./../Controllers/studentsController.js");
const Student = require("./../Models/StudentSchema.js");
const Speaker = require("./../Models/SpeakerSchema.js");
const Admins = require("./../Models/AdminSchema.js");
const { request } = require('express');


async function checkMailAndPassword(dataBase, request, response, next) {
    try {
        let data = await dataBase.findOne({ "email": request.body.email });
        if (data == null) {
            throw new Error("this user is not found")
        } else {
            let matched = await bcrypt.compare(request.body.password, data.password)
            if (matched) {
                // console.log(data);
                let token = jwt.sign({
                    email: request.body.email,
                    password: request.body.password,
                    role: (() => {
                        if (request.body.isAdmin == true) { return "admin" }
                        if (request.body.isSpeaker == true) { return "speaker" }
                        else { return "student" }
                    })(),
                    id: request.body._id
                }, process.env.SECRET_KEY, { expiresIn: "2h" })
                response.status(201).json({ message: "logged in", data, token })
            } else {
                throw new Error("either mail or password is wrong")
            }
        }
    } catch (error) {
        next(error);
    }

}

async function checkMailAndPassword_updatepass(dataBase, request, response, next) {
    try {
        let data = await dataBase.findOne({ "email": request.body.email });
        if (data == null) {
            throw new Error("this user is not found")
        } else {
            let matched = await bcrypt.compare(request.body.password, data.password)
            console.log(matched, data.password, request.body.password, request.body.newPassword)
            if (matched) {
                console.log(data)
                return data;
            } else {
                console.log(data)
                throw new Error("either mail or password is wrong")
            }
        }
    } catch (error) {
        next(error);
    }

}

exports.createUser = (request, response, next) => {
    if (request.body.isSpeaker) {//is a speaker 
        speakerController.addSpeaker(request, response, next);
    } else {// is a student 
        studentController.addStudent(request, response, next);
    }
}


exports.authenticateUser = (request, response, next) => {
    if (request.body.isSpeaker) {
        checkMailAndPassword(Speaker, request, response, next);
    } else {
        if (!request.body.isAdmin) {
            checkMailAndPassword(Student, request, response, next);
        } else if (request.body.isAdmin == true) {
            checkMailAndPassword(Admins, request, response, next);
        }
    }
}


exports.changePassword = async (request, response, next) => {
    try {
        let data = null;
        switch (request.role) {
            case "admin":
                if (request.body.isSpeaker) {
                    data = await checkMailAndPassword_updatepass(Speaker, request, response, next);
                    if (data) {
                        request.body.id = data.id
                        request.body.userName = data.userName;
                        request.body.email = data.email;
                        request.body.address = data.address;
                        request.body.role = data.role;
                        request.body.image = data.image;
                        request.body.password = request.body.newPassword;
                        speakerController.updateSpeaker(request, response, next);
                    } else {
                        throw new Error("something wrong with speakerdata")
                    }
                } else {
                    data = await checkMailAndPassword_updatepass(Student, request, response, next);
                    if (data) {
                        request.body.id = data.id
                        request.body.userName = data.userName;
                        request.body.email = data.email;
                        request.body.password = request.body.newPassword;
                        studentController.updateStudent(request, response, next);
                    } else {
                        throw new Error("something wrong with studentdata")
                    }
                }
                break;

            case "student":
                data = await checkMailAndPassword_updatepass(Student, request, response, next);
                if (data) {
                    request.body.id = data.id;
                    request.body.userName = data.userName;
                    request.body.email = data.email;
                    request.body.password = request.body.newPassword;
                    studentController.updateStudent(request, response, next);
                } else {
                    throw new Error("something wrong with studentdata")
                }
                break;

            case "speaker":
                data = await checkMailAndPassword_updatepass(Speaker, request, response, next);
                if (data) {
                    request.body.id = data.id;
                    request.body.userName = data.userName;
                    request.body.email = data.email;
                    request.body.address = data.address;
                    request.body.role = data.role;
                    request.body.image = data.image;
                    request.body.password = request.body.newPassword;
                    speakerController.updateSpeaker(request, response, next);
                } else {
                    throw new Error("something wrong with speakerdata")
                }
                break;
            default:
                console.log("none of the above");
                break;
        }

    } catch (error) {
        next(error);
    }
}
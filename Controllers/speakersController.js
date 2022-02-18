const { validationResult } = require("express-validator");
const Speaker = require("./../Models/SpeakerSchema.js");

//------------------------------------------ helper function 

function errorHandeler(request, next) {
    let errors = validationResult(request);
    try {
        if (!errors.isEmpty()) {
            let error = new Error();
            error.status = 422;
            error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
            throw error;
        }
    } catch (error) {
        next(error);
    }

}

//--------------------------------------- using async , await , promises 

exports.getAllSpeakers = async (request, response, next) => {
    try {
        let data = await Speaker.find({})
        response.status(200).json(data)
    } catch (error) {
        next(error);
    }
}


exports.getSpeakerById = async (request, response, next) => {
    try {
        let data = await Speaker.findById(request.body.id);
        response.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

exports.addSpeaker = async (request, response, next) => {
    errorHandeler(request, next);
    let newSpeaker = new Speaker({
        "_id": request.body.id,
        "userName": request.body.userName,
        "password": request.body.password,
        "email": request.body.email,
        "role": request.body.role,
        "image": request.file ? request.file.filename : request.body.image,
        "address": request.body.address
    });
    try {
        let data = await newSpeaker.save();
        response.status(201).json({ message: "speaker is added", data })
    } catch (error) {
        next(error)
    }
}

exports.updateSpeaker = async (request, response, next) => {
    errorHandeler(request, next);
    try {
        let data = await Speaker.findByIdAndUpdate(request.body.id, {
            $set: {
                "userName": request.body.userName,
                "password": request.body.password,
                // "email": request.body.email,
                "role": request.body.role,
                "image": request.file ? request.file.filename : request.body.image,
                "address": request.body.address
            }
        })
        if (data == null) throw new Error("speaker is not found!");
        response.status(201).json({ message: "speaker is updated", data })
    } catch (error) {
        next(error);
    }
}


exports.deleteSpeaker = async (request, response, next) => {
    try {
        let data = await Speaker.findByIdAndDelete(request.body.id);
        if (data == null) throw new Error("speaker is not found!");
        response.status(200).json({ message: "speaker is deleted", data })
    } catch (error) {
        next(error);
    }

}

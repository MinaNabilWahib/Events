const { validationResult } = require("express-validator");
const Event = require("./../Models/EventSchema.js");

//------------------------------------------ helper function 

function errorHandeler(request) {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;

    }
}

//---------------------------------------------- using promises , then , catch 
exports.getAllEvents = (request, response, next) => {
    //promises,then,callback 
    Event.find({}).populate({ path: 'mainSpeaker', select: "userName" })
        .populate({ path: 'speakers', select: "userName" })
        .populate({ path: 'students', select: "userName" })
        .then(data => {
            response.status(200).json(data);
        })
        .catch(error => {
            next(error);
        })
}

exports.getEventById = (request, response, next) => {
    Event.findById(request.body.id)
        .then(data => {
            response.status(200).json(data);
        })
        .catch(error => next(error))
}

exports.addEvent = (request, response, next) => {
    errorHandeler(request);
    let newEvent = new Event({
        "_id": request.body.id,
        "title": request.body.title,
        "eventDate": request.body.eventDate,
        "mainSpeaker": request.body.mainSpeaker,
        "speakers": request.body.speakers,
        "students": request.body.students
    });
    newEvent.save()
        .then(data => {
            response.status(201).json({ message: "new event is added", data })
        })
        .catch(error => next(error))
}

exports.updateEvent = (request, response, next) => {
    errorHandeler(request)

    Event.findByIdAndUpdate(request.body.id, {
        $set: {
            "title": request.body.title,
            "eventDate": request.body.eventDate,
            "mainSpeaker": request.body.mainSpeaker,
            "speakers": request.body.speakers,
            "students": request.body.students
        }
    })
        .then(data => {
            if (data == null) throw new Error("event is not found!");
            response.status(201).json({ message: "updated", data/*data: request.body*/ })
        })
        .catch(error => next(error));
}

exports.deleteEvent = (request, response, next) => {
    Event.findByIdAndDelete(request.body.id)
        .then(data => {
            if (data == null) throw new Error("event is not found");
            response.status(200).json({ message: "event is deleted", data })
        })
        .catch(error => next(error));
    // response.status(200).json({ data: "just one student deleted by id" })
}

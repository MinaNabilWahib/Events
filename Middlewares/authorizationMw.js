const Speaker = require("./../Models/SpeakerSchema.js");
const Student = require("./../Models/StudentSchema.js");

exports.isStudent = (request, response, next) => {
    if (request.role == "student" || request.role == "admin") {
        next()
    } else {
        console.log(request.role)
        throw new Error("not permitted")
    }
}

exports.isSpeaker = (request, response, next) => {
    if (request.role == "speaker" || request.role == "admin") {
        next()
    } else {
        throw new Error("not permitted")
    }
}

exports.isAdmin = (request, response, next) => {
    if (request.role == "admin") {
        next()
    } else {
        throw new Error("not permitted")
    }
}

exports.isThisSpeaker = async (request, response, next) => {
    if (request.role == "admin") {
        next();
    } else {
        let data;
        try {
            data = await Speaker.findOne({ "email": request.userEmail })
            if (data != null) {
                if (request.body.id == data.id) {
                    next();
                } else {
                    throw new Error("not permitted you are not this user nor admin")
                }
            } else {
                throw new Error("can't find this user using email")
            }

        } catch (error) {
            next(error)
        }
    }
}

exports.isThisStudent = async (request, response, next) => {
    if (request.role == "admin") {
        next();
    } else {
        let data;
        try {
            data = await Student.findOne({ "email": request.userEmail })
            if (request.body.id == data.id) {
                next();
            } else {
                throw new Error("not permitted you are not this user nor admin")
            }
        } catch (error) {
            next(error)
        }
    }
}
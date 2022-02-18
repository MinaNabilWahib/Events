const { validationResult } = require("express-validator");
const Student = require("./../Models/StudentSchema.js");

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

//---------------------------------------------- using promises , then , catch 

exports.getAllStudents = (request, response, next) => {
    //promises,then,callback 
    Student.find({})
        .then(data => {
            response.status(200).json(data);
        })
        .catch(error => {
            next(error);
        })

    // response.status(200).json([{ data: "List of students" }])
}

exports.getStudentById = (request, response, next) => {
    Student.findById(request.body.id)
        .then(data => {
            response.status(200).json(data);
        })
        .catch(error => next(error))
    // response.status(200).json({ data: "just one student by id" })
}

exports.addStudent = (request, response, next) => {
    errorHandeler(request, next);
    let newStudent = new Student({
        "_id": request.body.id,
        "userName": request.body.userName,
        "password": request.body.password,
        "email": request.body.email
    });
    newStudent.save()
        .then(data => {
            response.status(201).json({ message: "new student is added", data })
        })
        .catch(error => next(error))
    // response.status(201).json({ data: "student added" })
}

exports.updateStudent = (request, response, next) => {
    errorHandeler(request, next);
    Student.findByIdAndUpdate(request.body.id, {
        $set: {
            "userName": request.body.userName,
            "password": request.body.password,
            // "email": request.body.email
        }
    })
        .then(data => {
            if (data == null) throw new Error("student is not found!");
            response.status(201).json({ message: "updated", data })
        })
        .catch(error => next(error));
}

exports.deleteStudent = (request, response, next) => {
    Student.findByIdAndDelete(request.body.id)
        .then(data => {
            if (data == null) throw new Error("student is not found");
            response.status(200).json({ message: "stuedent is deleted", data })
        })
        .catch(error => next(error));
    // response.status(200).json({ data: "just one student deleted by id" })
}



//--------------------------------------- using async , await , promises 

// exports.getAllStudents = async (request, response, next) => {
//     try {
//         let data = await Student.find({})
//         response.status(200).json(data)
//     } catch (error) {
//         next(error);
//     }
//     // response.status(200).json([{ data: "List of students" }])
// }

// exports.getStudentById = async (request, response, next) => {
//     try {
//         let data = await Student.findById(request.body.id);
//         response.status(200).json(data);
//     } catch (error) {
//         next(error);
//     }

//     // response.status(200).json({ data: "just one student by id" })
// }

// exports.addStudent = async (request, response, next) => {
//     errorHandeler(request);
//     let newStudent = new Student({
//         "_id": request.body.id,
//         "userName": request.body.userName,
//         "password": request.body.password,
//         "email": request.body.email
//     });
//     try {
//         let data = await newStudent.save()
//         response.status(201).json({ message: "student is added", data })
//     } catch (error) {
//         next(error)
//     }


//     // response.status(201).json({ data: "student added" })
// }

// exports.updateStudent = async (request, response, next) => {
//     errorHandeler(request)
//     try {
//         let data = await Student.findByIdAndUpdate(request.body.id, {
//             $set: {
//                 "userName": request.body.userName,
//                 "password": request.body.password,
//                 "email": request.body.email
//             }
//         })
//         if (data == null) throw new Error("student is not found!");
//         response.status(201).json({ message: "student is updated", data })
//     } catch (error) {
//         next(error);
//     }
// }


// exports.deleteStudent = async (request, response, next) => {
//     try {
//         let data = await Student.findByIdAndDelete(request.body.id);
//         if (data == null) throw new Error("student is not found!");
//         response.status(200).json({ message: "student is deleted", data })
//     } catch (error) {
//         next(error);
//     }

// }

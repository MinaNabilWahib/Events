const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

//build schema 
const StudentSchema = new mongoose.Schema({
    "_id": Number,
    "userName": { type: String, required: true },
    "password": { type: String, required: true, bcrypt: true },
    "email": { type: String, required: true, unique: true }
}, { "_id": false });

// auto increment 
StudentSchema.plugin(AutoIncrement, { id: 'student_counter', inc_field: '_id' });
StudentSchema.plugin(require('mongoose-bcrypt'));
// register for schema in mongoose 
module.exports = mongoose.model("students", StudentSchema);
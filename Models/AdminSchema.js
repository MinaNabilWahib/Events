const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

//build schema 
const AdminSchema = new mongoose.Schema({
    "_id": Number,
    "userName": { type: String, required: true },
    "password": { type: String, required: true, bcrypt: true },
    "email": { type: String, required: true, unique: true },
    "isAdmin": { type: Boolean, required: true }
}, { "_id": false });

// auto increment 
// AdminSchema.plugin(AutoIncrement, { id: 'admin_counter', inc_field: '_id' });
AdminSchema.plugin(require('mongoose-bcrypt'));
// register for schema in mongoose 
module.exports = mongoose.model("admins", AdminSchema);
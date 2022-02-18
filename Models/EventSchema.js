const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

//build schema 
const EventSchema = new mongoose.Schema({
    "_id": Number,
    "title": { type: String, required: true },
    "eventDate": { type: Date, required: true },
    "mainSpeaker": { type: Number, required: true, ref: 'speakers' },/// number refer to speaker 
    "speakers": [{ type: Number, required: true, ref: 'speakers' }],
    "students": [{ type: Number, required: true, ref: 'students' }]
}, { "_id": false });

// auto increment 
EventSchema.plugin(AutoIncrement, { id: 'event_counter', inc_field: '_id' });
EventSchema.plugin(require('mongoose-bcrypt'));
// register for schema in mongoose 
module.exports = mongoose.model("events", EventSchema);
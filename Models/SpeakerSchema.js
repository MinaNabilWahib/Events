const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

//build schema 
const SpeakerSchema = new mongoose.Schema({
    "_id": Number,
    "userName": { type: String, required: true },
    "password": { type: String, required: true, bcrypt: true },
    "email": { type: String, required: true, unique: true },
    "role": { type: String, enum: ['STUDENT', 'INSTRUCTOR'], default: 'STUDENT' },
    "image": { type: String, required: false },
    "address": {
        "city": { type: String, required: true },
        "street": { type: String, required: false },
        "building": { type: String, required: false }
    }
}, { "_id": false });

// auto increment 
SpeakerSchema.plugin(AutoIncrement, { id: 'speaker_counter', inc_field: '_id' });
SpeakerSchema.plugin(require('mongoose-bcrypt'));
// register for schema in mongoose 
module.exports = mongoose.model("speakers", SpeakerSchema);
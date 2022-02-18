require('dotenv').config();
const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const authenticationRouter = require("./Routers/authenticationRouter.js");
const speakersRouter = require("./Routers/speakersRouter.js");
const studentsRouter = require("./Routers/studentsRouter.js");
const eventsRouter = require("./Routers/eventsRouter.js");



//image variables
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(path.join(__dirname, "images"));
        cb(null, path.join(__dirname, "images"))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toLocaleDateString().replace(/\//g, "-") + "-" + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/png")
        cb(null, true)
    else
        cb(null, false)
}

//create server
const app = express();

//listen on port number
app.listen(process.env.PORT || 8080, () => {
    console.log("I am live and listening...");
    console.log(process.env.NODE_MODE);
});


//connect to db
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("DB is Connected ...");
    })
    .catch(error => console.log(" DB Problem"))
// (async () => {
//     try {
//         const connection = await mongoose.connect("mongodb://localhost:27017/ITIEvents")
//         console.log("DB is Connected ...");
//         const AutoIncrement = AutoIncrementFactory(connection);
//     } catch (error) {
//         console.log(" DB Problem")
//     }
// })()

//Middlewares
//a-morgan middleware
app.use(morgan('tiny'));
//b-CORS middleware
let corOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "allowedHeaders": 'Content-Type,Authorization'
}
app.use(cors());

//image uploading 
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage, fileFilter }).single("image"))
//parsing 
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
//routes 
app.use(authenticationRouter);

app.use(speakersRouter);

app.use(studentsRouter);

app.use(eventsRouter)

//c-notfound paths middleware
app.use((request, response) => {
    response.status(404).json({ data: "not found" });
})
//d-error handling middleware
app.use((error, request, response, next) => {   //JS  code function.length
    let status = error.status || 500;
    response.status(status).json({ Error: error + "" });
})





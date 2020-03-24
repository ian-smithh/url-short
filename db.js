/**
 * @swagger
 * Connects to the DB. Consoles messages indicating status.
 */
const mongoose = require('mongoose');
const dbURL = "mongodb+srv://ian:dnQSgRz88cU4WxRY@cluster0-7y1qy.mongodb.net/URL-Shortener?retryWrites=true&w=majority";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.on("error", function (err) {
    console.log("Mongoose Error: ", err);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});
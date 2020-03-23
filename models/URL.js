const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let URLSchema = new Schema({
    original: {
        type: String
    },
    short: {
        type: String
    },
    created:{
        type: Date
    },
    hit: {
        type: Number
    }
});

let URL = mongoose.model('URL', URLSchema);
module.exports = URL;
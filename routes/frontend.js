const express = require('express');
const router = express.Router();
const uid = require('custom-id');
const path = require('path');
let URL = require('../models/URL');

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../public/index.html'));
});

module.exports = router;
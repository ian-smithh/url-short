const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');

router.get('/info/:url', function(req,res){
    let requested = req.params.url;
    URL.findOne({short:requested}, function(error,doc){
        if(error){
            console.log("Error while finding URL:",error);
            res.sendStatus(500);
        }
        else if (!doc){
            console.log("Cannot find requested URL");
            res.sendStatus(404);
        }
        else{
            res.json(doc);
        }
    })
});

module.exports = router;
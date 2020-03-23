const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');
const path = require('path');

router.get('/:url', function(req,res){
    let requested = req.params.url;
    URL.findOne({short:requested}, function(error,doc){
        if(error){
            console.log("Error while redirecting:",error);
            res.sendStatus(500);
        }
        else if (!doc){
            console.log("Cannot parse URL");
            res.status(404).sendFile(path.join(__dirname,'../public/404.html'));
        }
        else{
            let dest = "http://"+doc.original;
            doc.hit +=1;
            doc.save();
            res.redirect(dest);
        }
    });
});

module.exports = router;
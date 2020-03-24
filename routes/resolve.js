const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');
const path = require('path');

/**
 * @swagger
 * /{url}:
 *  get:
 *      summary: redirects a short URL to the matching real one
 *      description: finds the short URL in the DB and redirects to the long one.
 *      parameters:
 *          - name: url
 *            type: string
 *            in: path
 *            description: the link to resolve to a real URL
 * 
 *      responses:
 *          500:
 *              description: error while redirecting
 *          404:
 *              description: no corresponding long URL exists to match the given short one
 *          301:
 *              description: redirecting to the real/long URL
 */

router.get('/:url', function(req,res){
    let requested = req.params.url;
    URL.findOne({short:requested}, function(error,doc){
        if(error){
            console.log("Error while redirecting:",error);
            res.sendStatus(500);
        }
        else if (!doc){
            console.log("Cannot find URL");
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
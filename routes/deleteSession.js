const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');

/**
 * @swagger
 * /deleteSession/{id}:
 *  delete:
 *      summary: finds and deletes a session of URL creation.
 *      description: searches the DB for all URLs created with the given session ID and deletes them
 *      parameters:
 *          - name: sessionID
 *            type: string
 *            in: path
 *            description: the session to delete
 * 
 *      responses:
 *          500:
 *              description: error while deleting
 *          200:
 *              description: session successfully found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              urls:
 *                                  type: array
 *                                  items: URL objects
 */

router.delete('/deleteSession/:sessionID', function(req,res){
    let id = req.params.sessionID;

    URL.deleteMany({creator:id}, function(error,docs){
        if(error){
            console.log("Error deleting session ID",id);
            res.sendStatus(500);
        }
        else{
            res.send(docs);
        }
    });
});

module.exports = router;
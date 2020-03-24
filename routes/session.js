const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');

/**
 * @swagger
 * /getSession/{id}:
 *  get:
 *      summary: Gets and returns all shortened URLs created under the session ID
 *      description: Finds all URL objects in the database with a session ID that matches the provided one. Used to restore sessions by the frontend.
 *      parameters:
 *          - name: id
 *            type: string
 *            in: path
 *            description: the session ID to find all documents for
 *      responses:
 *          500:
 *              description: error in finding the given session ID
 *          404:
 *              description: could not find the given session ID
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

router.get('/getSession/:id', function(req,res) {
    let id = req.params.id;

    URL.find({creator:id}, function(error, docs){
        if(error){
            console.log("Error finding the specified user",error);
            res.sendStatus(500);
        }
        else if(!docs){
            console.log("No session with that ID was found.");
            res.sendStatus(404);
        }
        else{
            res.send(docs);
        }
    });
});

module.exports = router;
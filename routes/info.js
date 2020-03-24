const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');

/**
 * @swagger
 * /info/{url}?{id}:
 *  get:
 *      summary: finds and returns information about a URL
 *      description: uses a shortened URL to find the corresponding document in the DB.
 *      parameters:
 *          - name: url
 *            type: string
 *            in: path
 *            description: the URL to find information about
 *          - name: id
 *            type: string
 *            in: path
 *            required: false
 *            description: optional, the session ID to match with. Not all information about the URL will be returned if none is provided.
 * 
 *      responses:
 *          500:
 *              description: error while finding URL
 *          404:
 *              description: url not found
 *          200:
 *              description: URL found. If no session ID is provided, only original, short, and created will be provided.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              original:
 *                                  type: string
 *                              short:
 *                                  type: string
 *                              created:
 *                                  type: string
 *                              hit: 
 *                                  type: number
 *                              creator:
 *                                  type: string
 */

router.get('/info/:url', function(req,res){
    let requested = req.params.url;
    let id = req.query.id;
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
            if(id === doc.creator){
                res.send(doc);
            }
            else{
                res.send({"original": doc.original, "short":doc.short, "created": doc.created});
            }
        }
    });
});

module.exports = router;
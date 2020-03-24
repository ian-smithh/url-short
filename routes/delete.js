const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');
/**
 * @swagger
 * /delete/{shortURL}:
 *  delete:
 *      summary: finds and deletes a short URL
 *      description: searchs the DB for a matching shortened URL and deletes it.
 *      parameters:
 *          - name: short
 *            type: string
 *            in: path
 *            description: the link to delete
 * 
 *      responses:
 *          500:
 *              description: error while deleting
 *          404:
 *              description: the requested URL could not be found
 *          200:
 *              description: the requested URL was deleted. Sends the deleted URL.
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

router.delete('/delete/:short', function(req,res){
    let id = req.params.short;

    URL.findOneAndDelete({short:id}, function(error,doc){
        if(error){
            res.status(500);
            console.log("Error deleting",id,error);
        }
        else if(!doc){
            console.log("No documents with id",id,"exist to delete.");
            res.sendStatus(404);
        }
        else{
            console.log("Deleted",id);
            res.send(doc);
        }
    })
});

module.exports = router;
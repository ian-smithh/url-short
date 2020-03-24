const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');
/**
 * @swagger
 * /create/{url?sessionID}:
 *  post:
 *      summary: Creates and saves a new shortened URL
 *      description: Adds a database entry representing a URL, including the original, an 8-character shortened version, the creation date, the session the URL was created in, and how many times the shortened URL has been accessed.
 *      parameters:
 *          - name: url
 *            type: string
 *            in: path
 *            description: the link to shorten
 *          - name: ID
 *            type: string
 *            in: path
 *            required: false
 *            description: the session ID.
 * 
 *      responses:
 *          500:
 *              description: Error in saving the given URL
 *          200:
 *              description: Entry successfully saved
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
router.post('/create/:url', function (req, res) {
    let original = req.params.url.replace(/^https?:\/\//, '');
    let user = req.query.sessionID;

    let short = uid({});

    let shortened = new URL({
        original: original,
        short: short,
        created: new Date(),
        hit: 0,
    });
    if(user){
        shortened.creator = user;
    }
    shortened.save((error, document) => {
        if (error) {
            console.log('Error while saving new shortened URL:', error);
            res.status(500);
        }
        else {
            res.send(document);
        }
    });
});

module.exports = router;
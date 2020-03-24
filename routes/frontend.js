const express = require('express');
const router = express.Router();
const uid = require('custom-id');
const path = require('path');
let URL = require('../models/URL');

/**
 * @swagger
 * /:
 *  get:
 *      summary: redirects the request to the actual frontend, which is handled by webpack
 *      Description: express handles the backend and is not responsible for the UI. Therefore, the request is redirected to port 8080, where the webpack server should serve the frontend.
 *      responses:
 *          301:
 *              description: the frontend is at port 8080.
 */

router.get('/', function(req,res){
    res.redirect('http://localhost:8080');
});

module.exports = router;
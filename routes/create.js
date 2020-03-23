const express = require('express');
const router = express.Router();
const uid = require('custom-id');
let URL = require('../models/URL');

router.post('/create/:url', function (req, res) {
    let original = req.params.url.replace(/^https?:\/\//, '');

    URL.findOne({ original: original }, function (err, doc) {
        if (err) {
            console.log('Error while finding one: ', error);
        }
        else if (!doc) {
            let short = uid({});

            let shortened = new URL({
                original: original,
                short: short,
                created: new Date(),
                hit: 0,
            });
            shortened.save((error, document) => {
                if (error) {
                    console.log('Error while saving new shortened URL:', error);
                    res.status(500);
                }
                else {
                    res.json(document);
                }
            });
        }
        else {
            res.send(doc);
        }
    });
});

module.exports = router;
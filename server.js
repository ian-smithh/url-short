/**
 * @swagger
 * Starts up the server and connects to the DB. Uses port 3000 by default. Just don't uses port 8080, that's what webpack uses.
 * Server: express.js
 * DB: mongodb.
 */
const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const DB = require('./db');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

let create = require('./routes/create');
let resolve = require('./routes/resolve');
let info = require('./routes/info');
let frontend = require('./routes/frontend');
let session = require('./routes/session');
let deleteURL = require('./routes/delete');
let deleteSession = require('./routes/deleteSession');

app.listen(PORT, () => console.info('Server has started on', PORT));
console.info('Start the frontend in a separate terminal by running npm run frontend if you have not done so already');

app.use('/', create);
app.use('/', resolve);
app.use('/', info);
app.use('/', frontend);
app.use('/', session);
app.use('/', deleteURL);
app.use('/', deleteSession);

const swaggerDefinition = {
    info: {
        title: 'URL Shortener',
        version: '1.0.0',
        description: 'URL Shortening API'
    },
    basePath: '/'
}
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js','./models/*.js']
}
const swaggerSpec = swaggerJSDoc(options);
app.get('/etc/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
});
app.get('/etc/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'))
});
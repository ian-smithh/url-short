const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const DB = require('./db');
const path = require('path');

let create = require('./routes/create');
let resolve = require('./routes/resolve');
let info = require('./routes/info');
let frontend = require('./routes/frontend');

app.listen(PORT, () => console.info('Server has started on', PORT));

app.use('/', create);
app.use('/', resolve);
app.use('/', info);
app.use('/', frontend);
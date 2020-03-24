# URL Shortener
Includes an API *and* a frontend written in React with Material UI! How exciting.

## Usage
You can access and use the API either through the frontend or by making your own HTTP requests to the API. 
Either method is fine, use what works best for you.

You will need Node.js v.12 or newer and NPM v.6.14 or newer.

You can check both by running ```node --version``` and ```npm --version```. If you need to update your ```npm``` installation I suggest [NVM](http://nvm.sh).

Once your Node.js and NPM are in order, run ```npm install``` in the root of the project to install the necessary packages.

## Running the API
To start the API, run ```npm start``` in your terminal in the root of the project. 
Reference the terminal for any errors or messages. 

The API uses Express.js for routing and MongoDB/Mongoose for a database. Both will start automatically. 

API documentation is available at ```http://localhost:3000/etc/docs``` once the API is running.

## Running the Frontend

**You will need to start the API first. If you do not, things will not work.**

To start the frontend, run ```npm run frontend``` in a new terminal in the root of the project 
(yes, you will need two terminals to run the frontend and the API).

The frontend is written in React, using the [Material UI library](https://material-ui.com/), and is bundled and served using Webpack and Babel. It accesses the API using [Axios](https://www.npmjs.com/package/axios).

Navigate to ```http://localhost:8080``` to access the frontend.

## Tinkering

The project layout is pretty self-explanatory - Mongoose/MongoDB schemas go in ```models```, Express routes go in ```routes```.
If you add your own, make sure to import them in ```server.js```. You can also fiddle with the way Babel and Webpack work by editing their configuration files.
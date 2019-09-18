const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const config = require('../config');
const routes = require('./routes');
const ROUTES = require('./constants');


// DataBase
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.on('close', () => console.log('Database connection closed.'));
db.once('open', () => {
	const info = mongoose.connections[0];
	console.log(`Connected to database server ${info.host}:${info.port}/${info.name}`);
	// require('./mocks')();
});
mongoose.connect(config.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})
	.catch(error => console.log(`Connection completed with error: ${error}`));


// uses and sets
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));


// routes
app.use(`${ROUTES.ROUTES.HOME}`, routes.home);
app.use(`${ROUTES.ROUTES.USER}`, routes.users);


// server
app.listen(config.port, () => console.log(`Server has been started on port: ${config.port}`));

const mongoose = require('mongoose');
const config = require('../config');


const getDB = () => {
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
};

module.exports = getDB;

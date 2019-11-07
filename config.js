const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root(`.env.${process.env.NODE_ENV}`) });

module.exports = {
	host: process.env.HOST,
	port: process.env.PORT || 3001,
	mongoURI: process.env.MONGO_URL,
	accessSecretKey: process.env.ACCESS_SECRET_KEY,
	refreshSecretKey: process.env.REFRESH_SECRET_KEY,
};

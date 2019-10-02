const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
	host: process.env.HOST,
	port: process.env.PORT || 3001,
	mongoURI: process.env.MONGO_URL,
	secretKey: process.env.SECRET_KEY,
};

const mongoose = require('mongoose');

/* eslint-disable prefer-destructuring */
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		refreshToken: String,
		// deviceId: {
		// 	type: String,
		// 	unique: true,
		// 	sparse: true,
		// },
		deviceId: String,
	},
);
// "migrate-mongo up"
module.exports = mongoose.model('RefreshToken', schema);

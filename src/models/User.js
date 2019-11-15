const mongoose = require('mongoose');
const models = require('./index');

/* eslint-disable prefer-destructuring */
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 100,
		},
		lastName: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 100,
		},
		age: {
			type: Number,
			min: 1,
			max: 150,
		},
		email: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 100,
		},
		password: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 100,
		},
		// refreshTokenList: [
		// 	{
		// 		type: Schema.Types.ObjectId,
		// 		ref: 'RefreshToken',
		// 	},
		// ],
		refreshTokenList: [
			{
				refreshToken: String,

				deviceId: String,
			},
		],
	},
	{
		timestamps: true,
	},
);

// schema.set('toJSON', {
// virtuals: true,
// });

module.exports = mongoose.model('User', schema);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');


const config = require('../../config');
const { INFO } = require('../constants');


const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(INFO.SALT_ROUNDS);
	return bcrypt.hash(password, salt);
};


const comparePassword = (password, hashedPassword) => bcrypt
	.compare(password, hashedPassword);


const generateToken = (payload) => ({
	accessToken: jwt.sign({ data: payload }, config.accessSecretKey, { expiresIn: '1h' }),
	refreshToken: jwt.sign({ userId: payload.userInfo.id }, config.refreshSecretKey, { expiresIn: '1w' }),
	expireTime: moment().add(1, 'hours').toISOString(),
});


const responseDataCreate = (...rest) => {
	let obj = {};
	rest.map(item => obj = { ...obj, ...item});
	return obj;
};


/* eslint-disable no-underscore-dangle */
const transformUserToResponse = (user) => {
	const userInfo = user._doc;
	return {
		userInfo: {
			id: userInfo._id || userInfo.id,
			firstName: userInfo.firstName,
			lastName: userInfo.lastName,
			age: userInfo.age,
			email: userInfo.email,
			createdAt: userInfo.createdAt,
			updatedAt: userInfo.updatedAt,
		},
	};
};

module.exports = {
	hashPassword,
	comparePassword,
	generateToken,
	responseDataCreate,
	transformUserToResponse,
};


// const ValidationString = (value) => !(!value && (value.length < 1 || value.length >= 150));
//
// const ValidationNumber = (value) => {
// 	const raw = parseInt(value, 10);
// 	return !!(value && (raw > 18 && raw <= 150));
// };


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Il9pZCI6IjVkOTMwNmI1ZDY5NDMxMjhjY2U0NGNiZCIsImZpcnN0TmFtZSI6Im9sb2xvIiwibGFzdE5hbWUiOiJwZXctcGV3IiwiYWdlIjozMywiZW1haWwiOiJvbG9sby1wZXctcGV3MUBtYWlsLnJ1IiwicGFzc3dvcmQiOiIkMmIkMTAkUFlNODIuRXFXdEZ5M3h3eEdtOFVnTzVDbjJraUFUMDFUeFYuaEU4RjBvT3ppUm4zaHlIN0ciLCJjcmVhdGVkQXQiOiIyMDE5LTEwLTAxVDA3OjU2OjM3LjE5NFoiLCJ1cGRhdGVkQXQiOiIyMDE5LTEwLTAyVDA0OjU3OjQ5LjYyN1oiLCJfX3YiOjB9LCJpYXQiOjE1Njk5OTk5MDUsImV4cCI6MTU3MDAwMzUwNX0.c5taPlaFPwLPhi0sBojJd0kr5K4HaDSReS2kK7qLLFk

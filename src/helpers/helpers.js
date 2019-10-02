const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { validationResult } = require('express-validator');
const {
	RESPONSE_STATUSES,
	RESPONSE_CODES,
	ERROR_MESSAGES,
} = require('../constants');

const config = require('../../config');
const { errorResponse } = require('../routes/resSchemes/resSchemes');
const { INFO } = require('../constants');


const validationResponse = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse({
			res,
			status: RESPONSE_STATUSES.CODE_422,
			code: RESPONSE_CODES.VALIDATION_ERROR,
			message: ERROR_MESSAGES.INVALID_DATA,
			data: errors.array(),
		});
	}
	return next();
};


const errorCatch = (err, req, res, next) => {
	res.status(RESPONSE_STATUSES.CODE_500).json({
		code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
		message: ERROR_MESSAGES.SERVER_ERROR,
		error: {},
	});
	throw new Error(ERROR_MESSAGES.SERVER_ERROR);
};


const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(INFO.SALT_ROUNDS);
	return bcrypt.hash(password, salt);
};


const comparePassword = async (password, hashedPassword) => bcrypt
	.compare(password, hashedPassword);


const generateToken = (payload) => ({
	accessToken: jwt.sign({ payload }, config.secretKey, { expiresIn: '1h' }),
	expireTime: moment().add(1, 'hours').toISOString(),
});


const verifyToken = async (req, res, next) => {
	try {
		let token = req.headers.authorization || req.headers.Authorization;
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length);
		}
		const validateToken = await jwt.verify(token, config.secretKey);
		if (validateToken) {
			return next();
		}
	} catch (error) {
		return errorResponse({
			res,
			status: RESPONSE_STATUSES.CODE_401,
			code: RESPONSE_CODES.UNAUTHORIZED,
			message: ERROR_MESSAGES.UNAUTHORIZED,
			data: error,
		});
	}
};


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
	validationResponse,
	errorCatch,
	hashPassword,
	comparePassword,
	generateToken,
	verifyToken,
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

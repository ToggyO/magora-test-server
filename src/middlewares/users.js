const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const { errorResponse } = require('../routes/resSchemes/resSchemes');
const {
	RESPONSE_STATUSES,
	RESPONSE_CODES,
	ERROR_MESSAGES,
} = require('../constants');


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


const verifyToken = async (req, res, next) => {
	try {
		let token = req.headers.authorization || req.headers.Authorization;
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length);
		}
		const validateToken = await jwt.verify(token, config.accessSecretKey);
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


module.exports = {
	validationResponse,
	errorCatch,
	verifyToken,
};

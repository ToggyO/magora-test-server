const models = require('../models');
const { responseDataCreate, writeRefreshTokenToDB } = require('../helpers/helpers');
const { successResponse, errorResponse } = require('../routes/resSchemes/resSchemes');
const {
	generateToken,
	comparePassword,
	transformUserToResponse,
} = require('../helpers/helpers');
const {
	RESPONSE_STATUSES,
	RESPONSE_CODES,
	ERROR_MESSAGES,
} = require('../constants');
const jwt = require('jsonwebtoken');


module.exports = {
	authenticate: async (req, res, next) => {
		try {
			const authData = req.body;
			const user = await models.User.findOne({ email: authData.email });
			if (user) {
				const comparedPassword = await comparePassword(authData.password, user.password);
				if (comparedPassword) {
					const userInfo = await transformUserToResponse(user);
					const token = await generateToken(userInfo);
					await writeRefreshTokenToDB(userInfo.userInfo.id, token.refreshToken);
					return successResponse({
						res,
						status: RESPONSE_STATUSES.CODE_200,
						code: RESPONSE_CODES.SUCCESS,
						data: responseDataCreate(userInfo, token),
					});
				}
				return errorResponse({
					res,
					status: RESPONSE_STATUSES.CODE_400,
					code: RESPONSE_CODES.BAD_PARAMETERS,
					message: ERROR_MESSAGES.INVALID_USER,
				});
			}
			return errorResponse({
				res,
				status: RESPONSE_STATUSES.CODE_400,
				code: RESPONSE_CODES.BAD_PARAMETERS,
				message: ERROR_MESSAGES.INVALID_USER,
			});
		} catch (error) {
			return next(error);
		}
	},
	refreshToken: async (req, res, next) => {
		try {
			const token = req.body.refreshToken;
			const user = await models.User.findOne({ 'refreshTokenList.refreshToken': token });
			if (user) {
				const decodedToken = await jwt.decode(token);
				console.log(decodedToken);
				const userInfo = await transformUserToResponse(user);
				const newToken = await generateToken(userInfo);
				await writeRefreshTokenToDB(userInfo.userInfo.id, newToken.refreshToken);
				return successResponse({
					res,
					status: RESPONSE_STATUSES.CODE_200,
					code: RESPONSE_CODES.SUCCESS,
					data: responseDataCreate(newToken),
				});
			}
			return errorResponse({
				res,
				status: RESPONSE_STATUSES.CODE_401,
				code: RESPONSE_CODES.UNAUTHORIZED,
				message: ERROR_MESSAGES.UNAUTHORIZED,
			});
		} catch (error) {
			return next(error);
		}
	},
};

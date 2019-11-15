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


module.exports = {
	authenticate: async (req, res, next) => {
		try {
			const { body, headers } = req;
			const authData = body;
			const deviceId = headers['user-agent'].replace(/\D+/g, '');
			const user = await models.User.findOne({ email: authData.email });
			if (user) {
				const comparedPassword = await comparePassword(authData.password, user.password);
				if (comparedPassword) {
					const userInfo = await transformUserToResponse(user);
					const token = await generateToken(userInfo);
					await writeRefreshTokenToDB(userInfo.userInfo.id, token.refreshToken, deviceId);
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
			const { body, headers } = req;
			const token = body.refreshToken;
			const deviceId = headers['user-agent'].replace(/\D+/g, '');
			const user = await models.User.findOne({ 'refreshTokenList.refreshToken': token });
			if (user) {
				const userInfo = await transformUserToResponse(user);
				const newToken = await generateToken(userInfo);
				await writeRefreshTokenToDB(userInfo.userInfo.id, newToken.refreshToken, deviceId);
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


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDk2YzVhMDg3Mjg3YjIzNzg1OTI0OGMiLCJpYXQiOjE1NzAxODI2MjgsImV4cCI6MTU3MDc4NzQyOH0.Cz6iPWzdEbIB4gUU80p7eP_MWNoOrIsCVm77gntIH8seyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDk2YzVhMDg3Mjg3YjIzNzg1OTI0OGMiLCJpYXQiOjE1NzAxODI2MjgsImV4cCI6MTU3MDc4NzQyOH0.Cz6iPWzdEbIB4gUU80p7eP_MWNoOrIsCVm77gntIH8s

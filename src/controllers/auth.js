const models = require('../models');
const { responseDataCreate } = require('../helpers/helpers');
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
			const authData = req.body;
			const user = await models.User.findOne({ email: authData.email });
			if (user) {
				const comparedPassword = await comparePassword(authData.password, user.password);
				if (comparedPassword) {
					const token = generateToken(user);
					const userInfo = transformUserToResponse(user);
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
};

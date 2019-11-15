const models = require('../models');
const { hashPassword, transformUserToResponse } = require('../helpers/helpers');
const { successResponse, errorResponse } = require('../routes/resSchemes/resSchemes');
const {
	RESPONSE_STATUSES,
	RESPONSE_CODES,
	ERROR_MESSAGES,
} = require('../constants');


module.exports = {
	getUsers: async (req, res, next) => {
		try {
			const users = await models.User.find({});
			return successResponse({
				res,
				status: RESPONSE_STATUSES.CODE_200,
				code: RESPONSE_CODES.SUCCESS,
				data: users,
			});
		} catch (error) {
			return next(error);
		}
	},
	createUser: async (req, res, next) => {
		try {
			const user = req.body;
			const compareEmail = await models.User.findOne({ email: user.email });
			if (!compareEmail) {
				const hashedPassword = await hashPassword(user.password);
				const createdUser = await models.User.create({
					firstName: user.firstName,
					lastName: user.lastName,
					age: user.age,
					email: user.email,
					password: hashedPassword,
				});
				const userInfo = transformUserToResponse(createdUser);
				return successResponse({
					res,
					status: RESPONSE_STATUSES.CODE_201,
					code: RESPONSE_CODES.SUCCESS,
					data: userInfo,
				});
			}
			return errorResponse({
				res,
				status: RESPONSE_STATUSES.CODE_422,
				code: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
				message: ERROR_MESSAGES.USER_EXISTS,
			});
		} catch (error) {
			return next(error);
		}
	},
	updateUser: async (req, res, next) => {
		try {
			const { body, userData } = req;
			const { userInfo } = userData;
			const user = await models.User.findById({ _id: userInfo.id });
			if (user) {
				await models.User.findOneAndUpdate({ _id: userInfo.id }, {
					firstName: body.firstName,
					lastName: body.lastName,
					age: body.age,
					email: body.email,
				});
				const updatedUser = await models.User.findById({ _id: userInfo.id });
				return successResponse({
					res,
					status: RESPONSE_STATUSES.CODE_201,
					code: RESPONSE_CODES.SUCCESS,
					data: transformUserToResponse(updatedUser),
				});
			}
			return errorResponse({
				res,
				status: RESPONSE_STATUSES.CODE_422,
				code: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
				message: ERROR_MESSAGES.USER_EXISTS,
			});
		} catch (error) {
			return next(error);
		}
	},
	deleteUser: async (req, res, next) => {
		try {
			const { userData } = req;
			const { userInfo } = userData;
			const user = await models.User.findById({ _id: userInfo.id });
			if (user) {
				await models.User.findOneAndDelete({ _id: userInfo.id });
				return successResponse({
					res,
					status: RESPONSE_STATUSES.CODE_200,
					code: RESPONSE_CODES.SUCCESS,
					data: `User with Id: ${userInfo.id} successfully deleted`,
				});
			}
			return errorResponse({
				res,
				status: RESPONSE_STATUSES.CODE_400,
				code: RESPONSE_CODES.BAD_PARAMETERS,
				message: 'Invalid user id',
			});
		} catch (error) {
			return next(error);
		}
	},
};

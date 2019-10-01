const { hashPassword } = require('../helpers/helpers');
const models = require('../models');

module.exports = {
	getUsers: async (req, res, next) => {
		try {
			const users = await models.User.find({});
			res.status(200).json(users);
		} catch (error) {
			next(error);
		}
	},
	createUser: async (req, res, next) => {
		try {
			const user = req.body;
			const compareEmail = await models.User.findOne({ email: req.body.email });
			const hashedPassword = await hashPassword(user.password);
			if (!compareEmail) {
				const createdUser = await models.User.create({
					firstName: user.firstName,
					lastName: user.lastName,
					age: user.age,
					email: user.email,
					password: hashedPassword,
				});
				res.status(201).json(createdUser);
			} else {
				res.status(400).json({
					error: 'User with such email already exists',
				});
			}
		} catch (error) {
			next(error);
		}
	},
	updateUser: async (req, res, next) => {
		try {
			const user = req.body;
			await models.User.findOneAndUpdate({ _id: req.params.userId }, {
				firstName: user.firstName,
				lastName: user.lastName,
				age: user.age,
				email: user.email,
			});
			const updatedUser = await models.User.findById({ _id: req.params.userId });
			res.status(201).json(updatedUser);
		} catch (error) {
			next(error);
		}
	},
	deleteUser: async (req, res, next) => {
		try {
			const user = await models.User.findOneAndDelete({ _id: req.params.userId });
			if (user) {
				res.status(200).json({
					ok: `User with Id: ${req.params.userId} successfully deleted`,
				});
			} else {
				res.status(400).json({
					error: 'Invalid user id',
				});
			}
		} catch (error) {
			next(error);
		}
	},
};

const express = require('express');

const router = express.Router();
const ROUTES = require('../constants');
const models = require('../models');
const Validation = require('../helpers/helpers');

const userRoutes = (app) => {
	/**
	 * @swagger
	 * /user:
	 *    get:
	 *      tags:
	 *        - users
	 *      summary: Get the list of users
	 *      description: ''
	 *      produces:
	 *        - application/json
	 *      responses:
	 *        '200':
	 *          description: Successful operation
	 *          schema:
	 *            type: array
	 *            items:
	 *              $ref: '#/definitions/ApiResponses'
	 *        '400':
	 *          description: Invalid parameters
	 */
	router.get('/', async (req, res) => {
		try {
			const users = await models.User.find({});
			res.status(200).json(users);
		} catch (error) {
			throw new Error('Server Error');
		}
	});


	router.post(`${ROUTES.ROUTES.CREATE}`, async (req, res) => {
		const user = req.body;
		try {
			if (Validation(user.firstName) && Validation(user.lastName) && Validation(user.age)) {
				await models.User.create({
					firstName: user.firstName,
					lastName: user.lastName,
					age: user.age,
				});
				res.status(201).send('Successfully created');
			} else {
				res.status(401).send('Something wrong...');
			}
		} catch (error) {
			throw new Error('Server Error');
		}
	});


	router.put(`${ROUTES.ROUTES.UPDATE}/:userId`, async (req, res) => {
		const user = req.body;
		try {
			if (Validation(user.firstName) && Validation(user.lastName) && Validation(user.age)) {
				await models.User.findOneAndUpdate({ _id: req.params.userId }, {
					firstName: user.firstName,
					lastName: user.lastName,
					age: user.age,
				});
				res.status(201).send('Successfully updated');
			} else {
				res.status(401).send('Something wrong...');
			}
		} catch (error) {
			throw new Error('Server Error');
		}
	});


	router.delete(`${ROUTES.ROUTES.DELETE}/:userId`, async (req, res) => {
		try {
			const user = await models.User.findOneAndDelete({ _id: req.params.userId });
			if (user) {
				res.status(200).send(`User with Id: ${req.params.userId} successfully deleted`);
			} else {
				res.status(401).send('Something wrong...');
			}
		} catch (error) {
			throw new Error('Server Error');
		}
	});

	app.use(`${ROUTES.ROUTES.USER}`, router);
};

module.exports = userRoutes;

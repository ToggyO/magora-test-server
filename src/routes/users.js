const express = require('express');

const router = express.Router();
const ROUTES = require('../constants');
const models = require('../models');
const helpers = require('../helpers/helpers');


const userRoutes = (app) => {
	/**
	 * @swagger
	 *  components:
	 *    schemas:
	 *      User:
	 *        type: object
	 *        required:
	 *          - firstName
	 *          - lastName
	 *          - age
	 *        properties:
	 *          firstName:
	 *            type: string
	 *            description: before 1 and 150 symbols
	 *          lastName:
	 *            type: string
	 *            description: before 1 and 150 symbols
	 *          age:
	 *            type: number
	 *            maximum: 150
	 *            minimum: 18
	 *      UserResponse:
	 *        type: object
	 *        properties:
	 *          _id:
	 *            type: string
	 *          firstName:
	 *            type: string
	 *          lastName:
	 *            type: string
	 *          age:
	 *            type: number
	 *          createdAt:
	 *            type: string
	 *          updatedAt:
	 *            type: string
	 *          _v:
	 *            type: number
	 */

	/**
	 * @swagger
	 * tags:
	 *   name: Users
	 *   description: User management
	 */

	/**
	 * @swagger
	 * path:
	 *  /user:
	 *     get:
	 *        tags: [Users]
	 *        summary: Get the list of users
	 *        description: ''
	 *        produces:
	 *          - application/json
	 *        responses:
	 *          '200':
	 *            description: Successful operation
	 *          '500':
	 *              description: Server error
	 */
	router.get('/', async (req, res) => {
		try {
			const users = await models.User.find({});
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json({
				error: 'Server Error',
			});
			throw new Error('Server Error');
		}
	});

	/**
	 * @swagger
	 * path:
	 *  /user/create:
	 *      post:
	 *        tags: [Users]
	 *        summary: Get the list of users
	 *        description: ''
	 *        requestBody:
	 *          required: true
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/User'
	 *        responses:
	 *          '201':
	 *              description: Successful operation
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/UserResponse'
	 *          '400':
	 *              description: Invalid request body
	 *          '500':
	 *              description: Server error
	 */
	router.post(`${ROUTES.ROUTES.CREATE}`, async (req, res) => {
		const user = req.body;
		try {
			if (helpers.ValidationString(user.firstName)
				&& helpers.ValidationString(user.lastName)
				&& helpers.ValidationNumber(user.age)) {
				const createdUser = await models.User.create({
					firstName: user.firstName,
					lastName: user.lastName,
					age: user.age,
				});
				res.status(201).json(createdUser);
			} else {
				res.status(400).json({
					error: 'Invalid request body',
				});
			}
		} catch (error) {
			res.status(500).json({
				error: 'Server Error',
			});
			throw new Error('Server Error');
		}
	});

	/**
	 * @swagger
	 * path:
	 *  /user/update/{userId}:
	 *      put:
	 *        tags: [Users]
	 *        summary: Get the list of users
	 *        description: ''
	 *        parameters:
	 *          - in: path
   *            name: userId
	 *            description: User ID
	 *            scheme:
   *              type: string
	 *            required: true
	 *        requestBody:
	 *          required: true
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/User'
	 *        responses:
	 *          '201':
	 *              description: Successful operation
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/UserResponse'
	 *          '400':
	 *              description: Invalid parameters
	 *          '500':
	 *              description: Server error
	 */
	router.put(`${ROUTES.ROUTES.UPDATE}/:userId`, async (req, res) => {
		const user = req.body;
		try {
			if (helpers.ValidationString(user.firstName)
				&& helpers.ValidationString(user.lastName)
				&& helpers.ValidationNumber(user.age)) {
				await models.User.findOneAndUpdate({ _id: req.params.userId }, {
					firstName: user.firstName,
					lastName: user.lastName,
					age: user.age,
				});
				const updatedUser = await models.User.findById({ _id: req.params.userId });
				res.status(201).json(updatedUser);
			} else {
				res.status(400).json({
					error: 'Invalid parameters',
				});
			}
		} catch (error) {
			res.status(500).json({
				error: 'Server Error',
			});
			throw new Error('Server Error');
		}
	});

	/**
	 * @swagger
	 * path:
	 *  /user/delete/{userId}:
	 *      delete:
	 *        tags: [Users]
	 *        summary: Get the list of users
	 *        description: ''
	 *        parameters:
	 *          - in: path
	 *            name: userId
	 *            description: User ID
	 *            scheme:
	 *              type: string
	 *            required: true
	 *        responses:
	 *          '200':
	 *              description: Successful operation
	 *          '400':
	 *              description: Invalid user id
   *          '500':
	 *              description: Server error
	 */
	router.delete(`${ROUTES.ROUTES.DELETE}/:userId`, async (req, res) => {
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
			res.status(500).json({
				error: 'Server Error',
			});
			throw new Error('Server Error');
		}
	});

	app.use(`${ROUTES.ROUTES.USER}`, router);
};

module.exports = userRoutes;

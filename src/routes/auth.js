const express = require('express');
const { checkSchema } = require('express-validator');

const router = express.Router();
const authController = require('../controllers/auth');
const { validationResponse } = require('../helpers/helpers');
const { ROUTES } = require('../constants');
const { authValidate } = require('./validation');

const authRoutes = (app) => {
	/**
	 * @swagger
	 *  components:
	 *    schemas:
	 *      Authorization:
	 *        type: object
	 *        required:
	 *          - email
	 *          - password
	 *        properties:
	 *          email:
	 *            type: string
	 *          password:
	 *            type: string
	 *            maximum: 20
	 *            minimum: 6
	 *      AuthResponse:
	 *        type: object
	 *        properties:
	 *          accessToken:
	 *            type: string
	 *          firstName:
	 *            type: string
	 *          lastName:
	 *            type: string
	 *          age:
	 *            type: number
	 *          email:
	 *            type: string
	 *          password:
	 *            type: string
	 *          createdAt:
	 *            type: string
	 *          updatedAt:
	 *            type: string
	 *          _v:
	 *            type: number
	 *      ApiResponses:
	 *         type: 'object'
	 *         properties:
	 *           code:
	 *             type: 'string'
	 *           data:
	 *             type: 'object'
	 *           message:
	 *             type: 'string'
	 *           errors:
	 *             type: 'array'
	 */

	/**
	 * @swagger
	 * tags:
	 *   name: Token
	 *   description: Authorization
	 */

	/**
	 * @swagger
	 * path:
	 *  /auth:
	 *      post:
	 *        tags: [Users]
	 *        summary: Get the list of users
	 *        description: ''
	 *        requestBody:
	 *          required: true
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/UserCreate'
	 *        responses:
	 *          '201':
	 *              description: Successful operation
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/UserResponse'
	 *          '400':
	 *              description: User with such email already exists
	 *          '422':
	 *              description: Invalid parameters
	 *          '500':
	 *              description: Server error
	 */
	router.post('/', checkSchema(authValidate), validationResponse, authController.authenticate);

	app.use(`${ROUTES.AUTH}`, router);
};

module.exports = authRoutes;

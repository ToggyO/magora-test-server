const express = require('express');
const { checkSchema } = require('express-validator');

const router = express.Router();
const authController = require('../controllers/auth');
const { validationResponse } = require('../middlewares/users');
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
	 *          code:
	 *            type: string
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
	 *      SuccessResponse:
	 *         type: 'object'
	 *         properties:
	 *           code:
	 *             type: 'string'
	 *           data:
	 *             type: 'object'
	 *      ErrorResponse:
	 *         type: 'object'
	 *         properties:
	 *           code:
	 *             type: 'string'
	 *           message:
	 *             type: 'string'
	 *           errors:
	 *             type: 'object'
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
	 *        tags: [Token]
	 *        summary: Get the list of users
	 *        description: ''
	 *        requestBody:
	 *          required: true
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/Authorization'
	 *        responses:
	 *          '201':
	 *              description: Successful operation
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/SuccessResponse'
	 *          '400':
	 *              description: User with such email already exists
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/ErrorResponse'
	 *          '422':
	 *              description: Invalid parameters
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/ErrorResponse'
	 *          '500':
	 *              description: Server error
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/ErrorResponse'
	 */
	router.post('/', checkSchema(authValidate), validationResponse, authController.authenticate);

	app.use(`${ROUTES.AUTH}`, router);
};

module.exports = authRoutes;

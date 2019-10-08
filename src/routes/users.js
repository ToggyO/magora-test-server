const express = require('express');
const { checkSchema } = require('express-validator');

const router = express.Router();
const userController = require('../controllers/users');
const { ROUTES } = require('../constants');
const { validationResponse, verifyToken } = require('../middlewares/users');
const {
	userValidate,
	userCreateValidate,
} = require('./validation');

const userRoutes = (app) => {
	/**
	 * @swagger
	 *  components:
	 *    schemas:
	 *      UserCreate:
	 *        type: object
	 *        required:
	 *          - firstName
	 *          - lastName
	 *          - age
	 *          - email
	 *          - password
	 *        properties:
	 *          firstName:
	 *            type: string
	 *            description: between 1 and 150 symbols
	 *          lastName:
	 *            type: string
	 *            description: between 1 and 150 symbols
	 *          age:
	 *            type: number
	 *            maximum: 150
	 *            minimum: 1
	 *          email:
	 *            type: string
	 *          password:
	 *            type: string
	 *            maximum: 20
	 *            minimum: 6
	 *      UserUpdate:
	 *        type: object
	 *        required:
	 *          - firstName
	 *          - lastName
	 *          - age
	 *          - email
	 *        properties:
	 *          firstName:
	 *            type: string
	 *            description: between 1 and 150 symbols
	 *          lastName:
	 *            type: string
	 *            description: between 1 and 150 symbols
	 *          age:
	 *            type: number
	 *            maximum: 150
	 *            minimum: 1
	 *          email:
	 *            type: string
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
	 *              description: Successful operation
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/SuccessResponse'
	 *          '500':
	 *              description: Server error
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/ErrorResponse'
	 */
	router.get('/', userController.getUsers);

	/**
	 * @swagger
	 * path:
	 *  /user/create:
	 *      post:
	 *        tags: [Users]
	 *        summary: Create user
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
	router.post(`${ROUTES.CREATE}`, checkSchema(userCreateValidate), validationResponse, userController.createUser);

	/**
	 * @swagger
	 * path:
	 *  /user/update/{userId}:
	 *      put:
	 *        tags: [Users]
	 *        summary: Update user's info  by id
	 *        description: ''
	 *        security:
	 *          - bearerAuth:
	 *              type: http
	 *              scheme: bearer
	 *              bearerFormat: JWT
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
	 *                $ref: '#/components/schemas/UserUpdate'
	 *        responses:
	 *          '201':
	 *              description: Successful operation
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/UserResponse'
	 *          '400':
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
	router.put(`${ROUTES.UPDATE}/:userId`, verifyToken, checkSchema(userValidate), validationResponse, userController.updateUser);

	/**
	 * @swagger
	 * path:
	 *  /user/delete/{userId}:
	 *      delete:
	 *        tags: [Users]
	 *        summary: Delete user by id
	 *        description: ''
	 *        security:
	 *          - bearerAuth:
	 *              type: http
	 *              scheme: bearer
	 *              bearerFormat: JWT
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
	 *              content:
	 *                application/json:
	 *                  schema:
	 *                    $ref: '#/components/schemas/SuccessResponse'
	 *          '400':
	 *              description: Invalid user id
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
	router.delete(`${ROUTES.DELETE}/:userId`, verifyToken, userController.deleteUser);

	app.use(`${ROUTES.USER}`, router);
};

module.exports = userRoutes;

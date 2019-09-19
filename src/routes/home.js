const express = require('express');

const router = express.Router();
const ROUTES = require('../constants');

const homeRoutes = (app) => {
	/**
	 * @swagger
	 *  /:
	 *    get:
	 *      tags:
	 *        - users
	 *      summary: Add a new user into the system
	 *      description: ''
	 *      consumes:
	 *        - application/json
	 *      responses:
	 *        '200':
	 *          description: Successful operation
	 *        '400':
	 *          description: Invalid email/password supplied
	 */
	router.get(`${ROUTES.ROUTES.HOME}`, (req, res) => {
		res.status(200).send('<h2>Привет Express!</h2>');
	});

	app.use(`${ROUTES.ROUTES.HOME}`, router);
};

module.exports = homeRoutes;

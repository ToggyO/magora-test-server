const express = require('express');

const router = express.Router();
const ROUTES = require('../constants');
const config = require('../../config');

const homeRoutes = (app) => {
	router.get(`${ROUTES.ROUTES.HOME}`, (req, res) => {
		res.status(200).send(`<div><h2>Привет, Хакер!</h2><p>Ссылка на сваггер: <a href=${config.host}:${config.port}/swagger>${config.host}:${config.port}/swagger</a></p></div>`);
	});

	app.use(`${ROUTES.ROUTES.HOME}`, router);
};

module.exports = homeRoutes;

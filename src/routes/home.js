const express = require('express');

const router = express.Router();
const ROUTES = require('../constants');

router.get(`${ROUTES.ROUTES.HOME}`, (req, res) => {
	res.status(200).send('<h2>Привет Express!</h2>');
});

module.exports = router;

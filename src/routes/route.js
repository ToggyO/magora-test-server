const express = require('express');

const router = express.Router();
const ROUTES = require('../constants/index');

router.get(ROUTES.ROUTES.BASE_URL, (req, res) => {
	// res.sendStatus(404);
	res.status(200).send('<h2>Привет Express!</h2>');
});

module.exports = router;

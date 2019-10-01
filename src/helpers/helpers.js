const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const { INFO } = require('../constants');


const validationResponse = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	return next();
};

const errorCatch = (err, req, res, next) => {
	res.status(500).json({
		error: 'Server Error',
	});
	throw new Error('Server Error');
};

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(INFO.SALT_ROUNDS);
	return bcrypt.hash(password, salt);
};

module.exports = {
	hashPassword,
	validationResponse,
	errorCatch,
};


// const ValidationString = (value) => !(!value && (value.length < 1 || value.length >= 150));
//
// const ValidationNumber = (value) => {
// 	const raw = parseInt(value, 10);
// 	return !!(value && (raw > 18 && raw <= 150));
// };

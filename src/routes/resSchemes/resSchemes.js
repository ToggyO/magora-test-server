const successResponse = ({ res, status, code, data = {} } = {}) => (
	res
		.status(status)
		.json({
			code,
			data,
		})
);

const errorResponse = ({ res, status, code, message, data = {} } = {}) => (
	res
		.status(status)
		.json({
			code,
			message,
			error: data,
		})
);

module.exports = {
	successResponse,
	errorResponse,
};

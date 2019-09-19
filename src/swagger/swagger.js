const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// const ROUTES = require('../constants');
// const config = require('../../config');

const options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Hello Users',
			version: '1.0.0',
			description: 'Test API for showing users',
		},
		// host: `${config.host}:${config.port}`,
		basePath: '/',
		// basePath: `${ROUTES.ROUTES.SWAGGER}`,
		definitions: {
			ApiResponses: {
				type: 'object',
				properties: {
					code: {
						type: 'string',
					},
					data: {
						type: 'object',
					},
					message: {
						type: 'string',
					},
					errors: {
						type: 'array',
					},
				},
			},
		},
	},
	apis: ['../routes/home.js'],
	// apis: ['../routes/home.js', '../routes/users.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

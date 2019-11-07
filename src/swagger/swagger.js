const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const ROUTES = require('../constants');
const config = require('../../config');

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Hello Users',
			version: '1.0.0',
			description: 'Test API for showing users',
		},
		// host: `${config.host}:${config.port}`,
		// basePath: '/',
		// basePath: `${ROUTES.ROUTES.SWAGGER}`,
		consumes: 'application/json',
		produces: 'application/json',
		servers: [
			{
				url: `${config.host}:${config.port}`,
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: [ROUTES.ROUTES.API_PATH],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = (app) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


/* eslint-disable */
// paths: {
// 	'/user': {
// 		get: {
// 			summary: 'Get the list of users',
// 				description: 'Get the list of users',
// 				responses: {
// 				200: {
// 					description: 'Successful operation',
// 						schema: {
// 						type: 'array',
// 							items: {
// 							$ref: '#/definitions/ApiResponses',
// 						},
// 					},
// 				},
// 				400: {
// 					description: 'Invalid parameters',
// 				},
// 			},
// 		},
// 	},
// 	'/user/create': {
// 		post: {
// 			summary: 'Create user',
// 				description: 'Create user',
// 				parameters: [
// 				{
// 					in: 'body',
// 					name: 'body',
// 					description: 'Create user',
// 					schema: {
// 						type: 'Object',
// 						properties: {
// 							firstName: { type: 'string' },
// 							lastName: { type: 'string' },
// 							age: {
// 								type: 'integer',
// 								format: 'int64',
// 							},
// 						},
// 					},
// 				},
// 			],
// 				produces: [
// 				'application/json',
// 			],
// 				responses: {
// 				200: {
// 					description: 'Successful operation',
// 						type: 'array',
// 						items: {
// 						$ref: '#/definitions/ApiResponses',
// 					},
// 				},
// 				400: {
// 					description: 'Invalid parameters',
// 				},
// 			},
// 		},
// 	},
// },

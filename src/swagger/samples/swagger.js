import path from 'path';
import glob from 'glob';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


/**
 * Get list of Endpoints files
 * @param dir
 * @returns {Promise<any>}
 */
export function getEndpoints({ dir } = {}) {
  return new Promise((resolve) => {
    const normalizedPath = path.join(__dirname, dir, '/*.router.js');
    const list = glob.sync(`${normalizedPath}`);
    resolve(list);
  });
}

/**
 * Swagger Initialization
 * @param props
 * @returns {Promise<void>}
 */
export async function run(props = {}) {
  const { dir, app, options = {} } = props;
  const { definitions } = options;
  const { URL_PREFIX_API, isPROD } = app.get('ENV');
  const endpoints = await getEndpoints({ dir });
  const swaggerOptions = {
    swaggerDefinition: {
      swagger: '2.0',
      info: {
        title: 'Leasing broker API',
        version: '1.0.0',
        description: 'API Documentation'
      },
      basePath: `${URL_PREFIX_API}`,
      schemes: isPROD ? ['https', 'http'] : ['http'],
      definitions: {
        ApiResponses: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
            },
            data: {
              type: 'object'
            },
            message: {
              type: 'string'
            },
            errors: {
              type: 'array'
            }
          }
        },
        ValidatorError: {
          type: 'object',
          properties: {
            code: {
              type: 'string'
            },
            message: {
              type: 'string'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  value: { type: 'string' },
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' }
                }
              }
            }
          }
        },
      },
      components: {
        parameters: {
          paginationOffset: {
            in: 'query',
            name: 'offset',
            description: 'The number of items to skip before starting to collect the result set.',
            required: false,
            schema: {
              type: 'integer',
              minimum: 0,
              default: 0
            }
          },
          paginationLimit: {
            in: 'query',
            name: 'limit',
            description: 'The number of items to return.',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10
            }
          },
          sort: {
            in: 'query',
            name: 'sort',
            description: 'Sorting criteria in the format: property(asc | desc). Default sort order is ascending.',
            required: false,
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'asc'
            }
          }
        },
        responses: {
          UnauthorizedError: {
            description: 'Authentication information is missing or invalid',
            headers: {
              WWW_Authenticate: {
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      securityDefinitions: {
        api_key: {
          in: 'header',
          type: 'apiKey',
          name: 'Authorization',
        }
      },
    },
    apis: endpoints,
  };

  if (definitions) {
    swaggerOptions.swaggerDefinition.definitions = { ...swaggerOptions.swaggerDefinition.definitions, ...definitions };
  }

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.use(`${URL_PREFIX_API}/documentation`, swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}




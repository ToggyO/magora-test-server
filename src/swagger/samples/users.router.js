import { Router } from 'express';
import { checkSchema } from 'express-validator';
import rateLimit from 'express-rate-limit';
import UsersModelFactory from './users.model';
import UsersControllerFactory from './users.controller';
import UsersMiddlewareFactory from './users.middleware';
import Role from '../../const/roles';

/**
 * Router: Users
 */
export default function router({ app, cors } = {}) {
  const router = Router();
  const { URL_PREFIX_API } = app.get('ENV');
  const db = app.get('db');
  const redis = app.get('redis');
  const UsersModel = UsersModelFactory({ connection: db, redis });
  const UsersController = UsersControllerFactory(UsersModel);
  const UsersMiddleware = UsersMiddlewareFactory(UsersModel);

  const loginLimiter = rateLimit({
    windowMs: 50 * 60 * 1000, // 1 hour
    max: 10 * 100, // start blocking after 10 requests - FIXME increased value (x100)
    message: 'Too many login tries from that IP, please try again after an hour.'
  });
  const resetPasswordLimiter = rateLimit({
    windowMs: 50 * 60 * 1000, // 1 hour
    max: 10 * 100, // start blocking after 10 requests - FIXME increased value (x100)
    message: 'Too many reset password tries from that IP, please try again after an hour.'
  });

  /**
   * @swagger
   * /users/list:
   *    get:
   *      tags:
   *        - users
   *      security:
   *        - api_key: []
   *      summary: Get the list of users
   *      description: ''
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: search
   *          in: query
   *          description: User email for search
   *          required: false
   *          type: string
   *        - $ref: '#/components/parameters/paginationOffset'
   *        - $ref: '#/components/parameters/paginationLimit'
   *        - $ref: '#/components/parameters/sort'
   *      responses:
   *        '200':
   *          description: Successful operation
   *          schema:
   *            type: array
   *            items:
   *              $ref: '#/definitions/Users'
   *        '400':
   *          description: Invalid parameters
   */
  router.options('/list', cors());
  router.get('/list', cors(), UsersMiddleware.authorize(), checkSchema(UsersController.schemas.list), UsersController.list);

  /**
   * @swagger
   * /users/login:
   *    post:
   *      tags:
   *        - users
   *      summary: Logs user into the system
   *      description: ''
   *      consumes:
   *        - application/json
   *      parameters:
   *        - in: body
   *          name: body
   *          description: The user email and password for login in clear text
   *          required:
   *            - body
   *          schema:
   *            properties:
   *              email:
   *                type: string
   *                required: true
   *              password:
   *                type: string
   *                required: true
   *              deviceId:
   *                type: string
   *                required: true
   *      responses:
   *        '200':
   *          description: Successful operation
   *          schema:
   *          type: string
   *          headers:
   *            X-Rate-Limit:
   *              type: integer
   *              format: int32
   *              description: calls per hour allowed by the user
   *            X-Expires-After:
   *              type: string
   *              format: date-time
   *              description: date in UTC when token expires
   *        '400':
   *          description: Invalid email/password supplied
   */
  router.options('/login', cors());
  router.post('/login', cors(), checkSchema(UsersController.schemas.login), loginLimiter, UsersController.login);

  /**
   * @swagger
   * /users/signup:
   *    post:
   *      tags:
   *        - users
   *      security:
   *        - api_key: []
   *      summary: Add a new user into the system
   *      description: ''
   *      consumes:
   *        - application/json
   *      parameters:
   *        - in: body
   *          name: body
   *          description: The user data in clear text
   *          required:
   *            - body
   *          schema:
   *            properties:
   *              email:
   *                type: string
   *                required: true
   *              password:
   *                type: string
   *                required: true
   *              firstName:
   *                type: string
   *                required: true
   *              lastName:
   *                type: string
   *                required: true
   *      responses:
   *        '200':
   *          description: Successful operation
   *          schema:
   *          type: string
   *          headers:
   *            X-Rate-Limit:
   *              type: integer
   *              format: int32
   *              description: calls per hour allowed by the user
   *            X-Expires-After:
   *              type: string
   *              format: date-time
   *              description: date in UTC when token expires
   *        '400':
   *          description: Invalid email/password supplied
   */

  router.options('/signup', cors());
  router.post('/signup', cors(), UsersMiddleware.authorize(Role.ADMIN), checkSchema(UsersController.schemas.signup), loginLimiter, UsersController.signup);

  /**
   * @swagger
   * /users/refresh:
   *    post:
   *      tags:
   *        - users
   *      summary: Get new access token
   *      description: ''
   *      consumes:
   *        - application/json
   *      parameters:
   *        - in: body
   *          name: body
   *          description: Refresh token in clear text
   *          required:
   *            - body
   *          schema:
   *            properties:
   *              token:
   *                type: string
   *                required: true
   *              deviceId:
   *                type: string
   *                required: true
   *      responses:
   *        '200':
   *          description: Successful operation
   *          schema:
   *          type: string
   *          headers:
   *            X-Rate-Limit:
   *              type: integer
   *              format: int32
   *              description: calls per hour allowed by the user
   *            X-Expires-After:
   *              type: string
   *              format: date-time
   *              description: date in UTC when token expires
   *        '400':
   *          description: Invalid token
   */
  router.options('/refresh', cors());
  router.post('/refresh', cors(), checkSchema(UsersController.schemas.refresh), UsersController.refresh);

  app.use(`${URL_PREFIX_API}/users`, router);
}

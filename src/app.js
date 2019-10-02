const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const config = require('../config');
const routes = require('./routes');
// const ROUTES = require('./constants');
const swagger = require('./swagger/swagger');
const getDB = require('./connectDB');
const { errorCatch } = require('./helpers/helpers');

// DataBase
getDB();

// uses and sets
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// swagger
swagger(app);

// routes
routes.homeRoutes(app);
routes.userRoutes(app);
routes.authRoutes(app);

// error handling
app.use(errorCatch);

// server
app.listen(config.port, () => console.log(`Server has been started on port: ${config.port}`));

/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');

const morgan = require('morgan');
const mysql = require('mysql2');

/**
 * server configuration
 */
const config = require('./config');
const dbService = require('./api/services/db.service');
const auth = require('./api/policies/auth.policy');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const DB = dbService(environment, config.migrate).start();


const mysqlDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test_mysql'
})

app.use(morgan('combined'));

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TODO setup your api routes here
// include routes
var routes = require('./routes/index');
app.use('/', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

/// ***** End of Routes ***** /// 

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Setup a global error handler.
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  // console.log(err)
  // console.log(err.message)
  return (
    res.status(500).json({
      message: err.message,
      stack: err.stack,
      error: process.env.NODE_ENV === 'production' ? {} : err,
    }))
});

server.listen(3003, () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  console.log("Server listening at 3003");
  return DB;
})


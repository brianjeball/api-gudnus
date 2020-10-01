/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

/**
 * express application
 */
const app = express();

app.use(morgan('combined'));

// allow cross origin requests
// configure to only allow requests from certain origins
const whitleListDomain = [
  'http://gudn.us',
  'https://gudn.us'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (whitleListDomain.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

app.use(cookieParser());
app.use(session({
  secret: "Shh, its a secret!",
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// require Mongoose
var mongoose = require("mongoose");
// CHANGE BEFORE BUILD
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

var db = mongoose.connection;

db.on("error", function (err) {
  console.log("connection error:", err);
});

db.once("open", function () {
  console.log(db.modelNames())
  console.log("db connection successful");
});

// include routes
var routes = require('./routes/routes');
app.use("/", routes);

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

  return (
    res.status(500).json({
      message: err.message,
      stack: err.stack,
      error: process.env.NODE_ENV === 'production' ? {} : err,
    }))
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

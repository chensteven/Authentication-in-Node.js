// General
var express = require('express'); // Server
var mongoose = require('mongoose'); // Database ODM
var passport = require('passport'); // Authentication

// Middleware
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash')
var session = require('express-session');

// Creating a server
var app = express();

// Server configuration
app.set('view engine', 'jade'); // view engine
app.set('views', __dirname + '/app/views'); // view files
app.use(express.static(__dirname + '/public')); // static files
app.use(morgan('dev')); // log all requests
app.use(cookieParser()); // read cookie (need for auth)
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Database connection
var dbConfig = require('./config/database.js');

// Passport configuration
app.use(session({ secret: 'overwatch', resave: false, saveUninitialized: true })); // session secret
app.use(passport.initialize()); // 
app.use(passport.session()); // persistent login sessions
app.use(flash()); // to flash messages stored in session

// Database Connection
mongoose.connect(dbConfig.url, function(err) {
	if (err) throw err;
	console.log('Successfully connected to ' + dbConfig.url);
});

// Passport
require('./config/passport')(passport);
// Routes
require('./app/routes/routes')(app, passport);

// Server listening
var port = 3030;
app.listen(port, function() {
	console.log('Server started listening at ' + port);
});


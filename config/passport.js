/* B001 - Refer to Trello Board */
var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user'); // Load user model

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Signup

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({ 'local.username' : username }, function(err, user) {
				// Returns an error if it can't connect to the database
				if (err) {
					return done(err);
				}
				// Returns an error if the username is taken
				if (user) { 
					console.log('User exists');
					console.log('Came from ' + req.url);
					return done(null, false, req.flash('signupMessage', 'That username is taken'));

				} 
				else {
					// Create new user
					var newUser = new User();

					// Storing user information
					newUser.local.username = username;
					newUser.local.password = newUser.generateHash(password);
					newUser.email = req.body.email;

					// Saving user
					newUser.save(function(err) {
						if (err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));

	// Login

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, username, password, done) {
		User.findOne({ 'local.username' : username }, function(err, user) {
			// Returns error if it can't connect to the database
			if (err) {
				return done(err);
			}
			// Returns error message if user doesn't exists
			if (!user) {
				return done(null, false, req.flash('loginMessage', 'Invalid Username: ' + username));
			}
			// Returns error message if password is incorrect
			if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Invalid Password'));
			}
			// Passes the user object 
			return done(null, user);
		});
	}));
};
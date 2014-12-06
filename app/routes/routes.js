module.exports = function(app, passport) {
	// GET Home page
	app.get('/', function(req, res) {
		res.render('index');
	});
	// GET Login page
	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage') });
	});
	// POST Login page
	app.post('/login', lowerCase, passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));
	// GET Signup Page
	app.get('/signup', function(req, res) {
		res.render('signup', { message: req.flash('signupMessage') });
	});
	// POST Signup Page
	app.post('/signup', lowerCase, passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));
	// GET Profile Page
	app.get('/profile', isLoggedIn, function(req, res) {
		console.log('Logged in');
		console.log(req);
		res.render('profile', { user: req.user });
	});
	// GET Logout
	app.get('/logout', function(req, res) {
		req.logout(); // a Passport method accessed within the request handler
		res.redirect('/');
	});

	// Using route middleware that redirects the user to site home page if they are not logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/');
	}
	// Convert username to lowercase
	function lowerCase(req, res, next) {
		req.body.username = req.body.username.toLowerCase();
		return next();
	}
	
}
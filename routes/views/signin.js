var keystone = require('keystone');
var async = require('async');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
    // Init locals
	locals.section = 'register';

	locals.formData = req.body || {};
	locals.validationErrors = {};
	
	view.on('post', function(next) {
		
		if (req.user) {
			 return res.redirect('/');
		 }

		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your email and password.');
		 	return next();
		 }
		
		var onSuccess = function() {
		   res.redirect('/');
		 }
		 var onFail = function() {
		 req.flash('error', 'Input credentials wer incorrect, please try again.')
		 return next();
		}
		
		keystone.session.signin({ email: req.body.email,password: req.body.password }, req, res, onSuccess, onFail);
	
	});
	
	// Render the view
	view.render('signin');
};

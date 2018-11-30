var keystone = require('keystone');
var async = require('async');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
    // Init locals
	locals.section = 'register';

	locals.formData = req.body || {};
	locals.validationErrors = {};
	
	if (req.user) {
	  return res.redirect('/');
	}

	//Form Validation and submit code
	
	view.on('post', function(next) {
		async.series([ 
			function(cb) {
					if (!req.body.fname || !req.body.username || !req.body.email || !req.body.password) {
						req.flash('error', 'Please enter required field!!!');
						return cb(true);
					}
					return cb();
				},
				function(cb) {
					if (req.body.password !== req.body.password_confirmation) {
						req.flash('error', 'Password not match with confirm Password!!');
						return cb(true);
					}
					return cb();
				},	
			function(cb) {
				keystone.list('User').model.findOne({username: req.body.username},function (err, user) {
					if (err || user) {
						req.flash('error','User already exists');
						return cb(true);
					}
					return cb();
				});
			},
			function(cb) {
					keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {
						if (err || user) {
							req.flash('error','Email already exists');
							return cb(true);
						}
						return cb();
					});
				},
			function(cb) {
					var userData = { username: req.body.username,
									name: { first: req.body.fname,last: req.body.lastname,},
									email: req.body.email,
									password: req.body.password
								};
					var User = keystone.list('User').model,newUser = new User(userData);
					newUser.save(function(err) {
						return cb(err);
					});
			}], 
			function(err){
					if (err) return next();
						var onSuccess = function() {
							req.flash('Success', 'Registration has been sccuessfully done..');	
						    res.redirect('/');
					}
					var onFail = function(e) {
						req.flash('error', 'There was a problem signing you up, please try again');
						return next();
					}
			
					keystone.session.signin({email: req.body.email, password: req.body.password},
						req, res, onSuccess, onFail);
				});
			});

	
	// Render the view
	view.render('register');
};

var keystone = require('keystone');
var async = require('async');
var User = keystone.list('User');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
    // Init locals
	locals.section = 'userprofile';
    locals.filters = {
		user: req.params.user
	};
	locals.formData = req.body || {};
	locals.data = {
		results: []
    };
    
    // On POST requests, add the Enquiry item to the database
	view.on('post', function (next) {
        console.log(req.body);
		async.series([ 
			function(cb) {
					if (!req.body.fname || !req.body.username || !req.body.email) {
						req.flash('error', 'Please enter required field!!!');
						return cb(true);
					}
					return cb();
				},
			function(cb) {
                keystone.list('User').model.findOne({$and: [{username: req.body.username},{ _id: { $ne: req.body.id } } ]}).exec(function(err, user){
				//keystone.list('User').model.findOne({username: req.body.username},function (err, user) {
					if (err || user) {
						req.flash('error','User already exists');
						return cb(true);
					}
					return cb();
				});
			},
			function(cb) {
                    keystone.list('User').model.findOne({$and: [{email: req.body.email},{ _id: { $ne: req.body.id } } ]}).exec(function(err, user){
					//keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {
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
									email: req.body.email
								};
                    User.model.findById(req.body.id).exec(function(err, item) {
                        item.getUpdateHandler(req).process(userData, function(err) {
                            return cb(err);
                        });
                    });
			}], 
			function(err){
                    if (err) return next();
                    req.flash('Success', 'Update has been sccuessfully done..');	
                    //res.redirect('back');
                    next();
			});
	});


    // Load the User
	view.on('init', function (next) {
		
		var q = keystone.list('User').model.findOne({
			slug:locals.filters.user
        });
        
		q.exec(function(err, result) {
			locals.data.user = result;
			next(err);
        });
       
	});

	// Render the view
	view.render('userprofile');
};

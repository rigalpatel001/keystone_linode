var keystone = require('keystone');
var async = require('async');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'courses';
	
	locals.data = {
		courses: []
	};

	
	// Load the Courses
	view.on('init', function (next) {

        var q = keystone.list('Course').paginate({
			page: req.query.page || 1,
			perPage: 8,
			maxPages: 10,
		});
		q.exec(function (err, results) {
			locals.data.courses = results;
			next(err);
		});

	});
	// Render the view
	view.render('courses');
};

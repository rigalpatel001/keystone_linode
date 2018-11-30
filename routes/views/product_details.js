var keystone = require('keystone');
var async = require('async');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'product Details';
	locals.filters = {
		product: req.params.slug
	};
	locals.data = {
		products: [],
		categories: []
	};

	// Load all categories
	view.on('init', function (next) {

		keystone.list('Category').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Product').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.productCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});



	// Load the Products
	view.on('init', function (next) {
		
		var q = keystone.list('Product').model.findOne({
			slug:locals.filters.product
		});

		q.exec(function(err, result) {
			locals.data.product	 = result;
			next(err);
		});
	});
	// Render the view
	view.render('product_details');
}; 

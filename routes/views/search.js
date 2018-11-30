var keystone = require('keystone');

exports = module.exports = function (req, res) {

var view = new keystone.View(req, res);
var locals = res.locals;

// Init locals
// Set locals
locals.filters = {
	keywords: req.query.keywords
};
locals.data = {
	products: [],
	keywords: "",
};

// Load the current product
view.on('init', function (next) {
		console.log('search keywords=' + locals.filters.keywords);
		locals.data.keywords = locals.filters.keywords;
		//search the full-text index
		keystone.list('Product').model.find({
				$text: {
					$search: locals.filters.keywords
				}
			   }, {
				score: {
					$meta: "textScore"
				}
			  }).sort({
				score: {
					$meta: 'textScore'
				}
		 }).limit(20).
		 exec(function (error, results) {
					 if (error) console.log(error);
					 locals.data.products = results
					 console.log(result);
					 next();
		});
    });
  view.render('search');

};

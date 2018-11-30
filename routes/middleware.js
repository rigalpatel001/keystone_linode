/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var keystone = require('keystone');
var _ = require('lodash');
var async = require('async');
var request = require('request');



/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	
	res.locals.navLinks = [
					{ label: 'Home', key: 'home', href: '/' },
					{ label: 'Contact', key: 'contact', href: '/contact' },
					{ label: 'Products', key: 'products', href: '/products' },
					{ label: 'Courses', key: 'courses', href: '/courses' },
					{ label: 'CRM', key: 'crm', href: '/crm' },
					
	];

	

	res.locals.cart = keystone.session.cart;			
	res.locals.user = req.user;
	res.locals.homeurl = req.headers.host;

	//get top three category
	keystone.list('Category').model.find().sort('name').limit(3).exec(function (err, results) {

		if (err || !results.length) {
			return next(err);
		}
		res.locals.categories = results;
	    next(); 
	});
	
};

/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	console.log('User reqquest');
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin');
	} else {
		next();
	}
};

/**
 *  Get Access Token suitecrm
 */

exports.login = function (callback) {
		
	var form = {
		"grant_type":"password",
	//local	"client_id":"a9204c23-30eb-ff31-6e84-5bd003206e6b",
		"client_id":"440781ee-dcfe-8c85-b289-5bec0149efba",
		"client_secret":"rigal",
		"username": "admin",
	//local	"password": "admin@123",
		"password": "scrm_2018!",
		"scope": ""
	}   
	var formData = JSON.stringify(form);
	request({
			headers: {
				'Accept': 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			},
			//local 	uri: 'http://localhost:8888/SuiteCRM/api/oauth/access_token',
				uri: 'http://midasflow.net.au/api/oauth/access_token',
				body: formData,
				method: 'POST'
			}, function (err, res, body) {
			//it works!
				if (!err) {
						var sessionID = JSON.parse(body).access_token;
						callback(sessionID);
					} else {
						//response.end(error);
						console.log(err);
					}
		});
}

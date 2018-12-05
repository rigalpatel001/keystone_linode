var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
var request = require('request');
var middleware = require('../middleware');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.error;
				console.log(err);
			} else {
				
				//Save data in Suitecrm
  
				params = {
				"data": {
				"type": "Contacts",
				"attributes": {
					"first_name": req.body.name,
					"last_name": req.body.name,
					"phone_work": req.body.phone,
					"email1": req.body.email,
					"contact_reason": req.body.enquiryType,
					"description": 	req.body.message,
				}
			  }
		   };
		  var formData = JSON.stringify(params);
		  middleware.login(function(sugarid){
			if (sugarid != 'undefined') {
				request({
					headers: {
						'Accept': 'application/vnd.api+json',
						'Content-Type': 'application/vnd.api+json',
						'Authorization': 'Bearer ' + sugarid
					},
					//local	uri: 'http://localhost:8888/SuiteCRM/api/v8/modules/Contacts',
						uri: 'https://midasflow.net.au/api/v8/modules/Contacts',
						method: 'POST',
						body: formData
					}, function (err, response, body) {
					    if (!err) {
					    	
							 req.flash('success', 'User Successfully added...');
							 //return res.redirect('/crm');
							// next();
						} else {
						      console.log(err);
						}
				}); 

			   } else {
				console.log("can't login, check your credentials");
			  }
			 });

		  		 locals.enquirySubmitted = true;
			}
			next();
		});

	});

	view.render('contact');
};

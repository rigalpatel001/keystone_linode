var keystone = require('keystone');
var async = require('async');
var sugar = require('node-sugarcrm-client');
var request = require('request');
var middleware = require('../middleware');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
    // Init locals
	locals.section = 'register';
	locals.data = {
		userlist: [],
		action : req.params.action,
		id : req.query.id,
	};

	locals.formData = req.body || {};
	locals.validationErrors = {};

		

	// var form = {
	// 	grant_type: "password",
	// 	client_id: "9258f32a-3b46-2b7a-f2eb-5bdaa633e534",
	// 	client_secret: "node_crm2018",
	// 	username: "admin",
	// 	password: "scrm_2018!",
	// 	scope: ""
	// };

	
/*var form = {
	"grant_type":"password",
	"client_id":"a9204c23-30eb-ff31-6e84-5bd003206e6b",
	"client_secret":"rigal",
	"username": "admin",
	"password": "admin@123",
	"scope": ""
}   
var formData = JSON.stringify(form);
 request({
		headers: {
		    'Accept': 'application/vnd.api+json',
			'Content-Type': 'application/vnd.api+json'
		},
			uri: 'http://localhost:8888/SuiteCRM/api/oauth/access_token',
			body: formData,
			method: 'POST'
		}, function (err, res, body) {
		//it works!
			if (!err) {
					console.log(body);
					var sessionID = JSON.parse(body).access_token;
					locals.sugarid = sessionID;
					//console.log(res);
				} else {
					//response.end(error);
					console.log(err);
				}
	});*/


	
	// var header = array(
	// 	'Content-type: application/vnd.api+json',
	// 	'Accept: application/vnd.api+json',
	// 	'Authorization: Bearer ' . $your_saved_access_token
	//  );

	  
	//Sugar conncetion
/*	sugar.init(
		{
			apiURL:  "http://localhost:8888/SuiteCRM/service/v4_1/rest.php"
			,login:   "admin"
			,passwd:  "admin@123"
	   }
    );

    // Load the User
		view.on('init', function (next) {
			// load users
			sugar.login(function(sugarid){
				if (sugarid != 'undefined') {
					locals.sugarid = sugarid;
				} else {
					console.log("can't login, check your credentials");
				}
		
				params = {
					session:  sugarid
				   ,module_name : "Contacts"
				   ,query : ""
				   ,order_by : ''
				   ,offset : '0'
				   ,select_fields : ['id','first_name','last_name','phone_work']
				   ,max_results : -1
				   ,deleted : '0'
				   ,Favorites : false
	
				};
				sugar.call("get_entry_list", params, function(res,err){
					if (err) {
						console.log(err)
					}
					else {
						console.log(res);
						//console.log(res.entry_list);
						//var results = JSON.parse(res.entry_list);
						var results = JSON.stringify(res.entry_list);
						locals.data.userlist = res.entry_list;
						//console.log(results);
						//console.log("First Name" + res.entry_list[0].name_value_list.first_name.value);
						next();
					}
				});
				
		   });
		  
		});*/

	//Form Validation and submit code
	view.on('post', function(next) {
		
		if (!req.body.first_name || !req.body.last_name || !req.body.email1) {
			req.flash('error', 'Please enter required field!!!');
			return next();
		}
			params = {
				"data": {
				"type": "Contacts",
				"attributes": {
					"first_name": req.body.first_name,
					"last_name": req.body.last_name,
					"phone_work": req.body.phone_work,
					"email1": req.body.email1
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
						uri: 'http://midasflow.net.au/api/v8/modules/Contacts',
						method: 'POST',
						body: formData
					}, function (err, response, body) {
					    if (!err) {
							 req.flash('success', 'User Successfully added...');
							 return res.redirect('/crm');
							 //next();
						} else {
						      console.log(err);
						}
				}); 

			} else {
				console.log("can't login, check your credentials");
			}
			});
		
	});

	view.on('init', function (next) {
		middleware.login(function(sugarid){
			if (sugarid != 'undefined') {
				//console.log(sugarid);
				request({
					headers: {
						'Accept': 'application/vnd.api+json',
						'Content-Type': 'application/vnd.api+json',
						'Authorization': 'Bearer ' + sugarid
					},
						uri: 'http://midasflow.net.au/api/v8/modules/Contacts',
						method: 'GET'
					}, function (err, res, body) {
					//it works!
						if (!err) {
							//console.log(body);
							 var results = JSON.parse(body).data;
						     locals.data.userlist = results;
							 next();
							} else {
								//response.end(error);
								console.log(err);
							}
				}); 

			} else {
				console.log("can't login, check your credentials");
			}
			});
		
	});

switch (locals.data.action) {
		case "remove":
		middleware.login(function(sugarid){
			if (sugarid != 'undefined') {
				
				request({
					headers: {
						'Accept': 'application/vnd.api+json',
						'Content-Type': 'application/vnd.api+json',
						'Authorization': 'Bearer ' + sugarid
					},
						uri: 'http://midasflow.net.au/api/v8/modules/Contacts/'+locals.data.id,
						method: 'DELETE'
					}, function (err, response, body) {
					    if (!err) {
							 req.flash('success', 'User Successfully Deleted...');
							 return res.redirect('/crm');
							 //next();
						} else {
						      console.log(err);
						}
				}); 

			} else {
				console.log("can't login, check your credentials");
			}
			});
		break;
		default:
			console.log('update problem');
			break;
	}		

	// Render the view
	view.render('crm');
};
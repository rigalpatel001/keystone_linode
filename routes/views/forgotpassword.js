var keystone = require('keystone'),
User = keystone.list('User');
var Email = require('keystone-email');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var home = req.headers.host;
	view.on('post', function (next) {

		if (!req.body.email) {
			req.flash('error', "Please enter an email address.");
			return next();
		}

		User.model.findOne().where('email', req.body.email).
		exec(function (err, user) {
			if (err) return next(err);
			if (!user) {
				req.flash('error', "Sorry, That emailaddress is not registered.");
				return next();
			}

			user.resetPasswordKey = keystone.utils.
			randomString([16, 24]);
			user.save(function (err) {
				if (err) return next(err);
				// new keystone.Email({
				// 	'templateName': 'forgotpassword',
				// 	'templateExt': 'pug'
				// }).send({
				// 	user: user,
				// 	link: '/resetpassword/' + user.resetPasswordKey,
				// 	subject: 'Reset your Password',
				// 	to: user.email,
				// 	from: {
				// 		name: 'IncTicket',
				// 		email: 'info@incticket.com'
				// 	}
				// }, function (err) {
				// 	if (err) {
				// 		console.error(err);
				// 		req.flash('error', 'Error sending resetpassword email!');
				// 		next();
				// 	} else {
				// 		req.flash('success', 'We have emailed you alink to reset your password');
				// 		res.redirect('/signin');
				// 	}
				// });
				new Email('forgotpassword', {
					transport: 'mailgun', engine: 'pug', root: 'templates/emails'
				  }).send({
					user: user,
					link: home +'/resetpassword/' + user.resetPasswordKey,
				  }, {
					apiKey: '2327544e12b844485a23a93c91c7183e-c8e745ec-ebb96e20',
					domain: 'sandbox6668016aacef493fa22ba91d4c7c1f7a.mailgun.org',
					to: 'rigal9979@gmail.com',
					from: {
					  name: 'Reset password',
					  email: 'keystonecart@hello.com',
					},
					subject: 'Reset Password KeystoneJS email',
				  }, function (err, result) {
					if (err) {
					 	req.flash('error', 'There was an error sending the emails, please check the logs for more info.');
					    console.error('🤕 Mailgun test failed with error:\n', err);
						next();
					} else {
						req.flash('success', 'Email Successfully sent.. ');
						res.redirect('/signin');
						console.log('📬 Successfully sent Mailgun test with result:\n', result);
					}
				  });


			// 	  new Email('member-notification', { transport: 'mandrill', engine: 'jade', root: 'templates/emails' }).send({
			// 		subscriber: subscriber,
			// 		content: req.body.subscriber_email_content,
			// 		link_label: req.body.subscriber_email_link_label,
			// 		link_url: req.body.subscriber_email_link_url,
			// 		host: 'http://www.sydjs.com',
			// 	}, {
			// 		subject: req.body.subscriber_email_subject || 'Notification from SydJS',
			// 		to: subscriber.email,
			// 		from: {
			// 			name: 'SydJS',
			// 			email: 'hello@sydjs.com'
			// 		}
			// 	}, doneSubscriber);
			// }, function(err) {
			// 	if (err) {
			// 		req.flash('error', 'There was an error sending the emails, please check the logs for more info.');
			// 		 console.error(err);
			// 	} else {
			// 		req.flash('success', 'Email Successfully sent.. ');
			// 	}
			// 	next();
			// });



			});
		});
	});
	view.render('forgotpassword');
}
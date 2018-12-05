var keystone = require('keystone');
var async = require('async');
var path = require('path');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'Course Details';
	locals.filters = {
		course: req.params.slug
	};
	locals.download = req.query.file;
	locals.formData = req.body || {};
	locals.data = {
		courses: [],
		results: [],
	};

	// Quiz Result 
	view.on('post', function(next) {
		
        if (!req.body) {
            req.flash('error', 'Please select questions !!!');
            return next();
        }
        var keys = Object.keys(req.body);
        keystone.list('Question').model.find({ _id: { $in: keys }, }).select('correctanswer').exec(function (err, result) {
                   
               // Check questions answer
                async.each(result, function (output, next) {
                        if(output.correctanswer == locals.formData[output._id]){
                            locals.data.results.push({
                                id: output._id,
                                answer : 'Correct'
                            });
                        } else {
                            locals.data.results.push({
                                id: output._id,
                                answer : 'Incorrect'
                            }); 
                        }
                }, function (err) {
                        next(err);
				});
				next();
		  }); 
		 
	});

	// Load the Course
	view.on('init', function (next) {
		
		if(locals.download){
			res.download('./public/uploads/'+locals.download, locals.download, function(err){
				if (err) {
				    console.log('Error in downloading'+ err);
				} else {
				  // decrement a download credit, etc.
				  console.log('Success..');
				}
			  });
			  next();
			 // res.end();
		}
		var q = keystone.list('Course').model.findOne({
			slug:locals.filters.course
		}).populate('questions');
		
		
		q.exec(function(err, result) {
			locals.data.courses	 = result;
			next(err);
		});
	});
	
	// Render the view
	view.render('course_details');
}; 

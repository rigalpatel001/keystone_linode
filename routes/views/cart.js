var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.action = {
		cart_action : req.params.action,
		product_id : req.query.id,
		cartitems : ''
	};
	 
	switch (locals.action.cart_action) {
		case "add":
			keystone.list('Product').model.findOne({ _id: locals.action.product_id }).exec(function (err, result) {
			
				if (typeof keystone.session.cart == "undefined") {
		
					keystone.session.cart = [];
					keystone.session.cart.push({
						id: result._id,
						title: result.name,
						qty: 1,
						price: parseFloat(result.price).toFixed(2),
						image: result.image.url,
					});
				} else {
					var cart = keystone.session.cart;
					var newItem = true;
					for (var i = 0; i < cart.length; i++) {
						if(cart[i].id ==  locals.action.product_id){
							cart[i].qty++;
							newItem = false;
							break;
						}
					}
					if (newItem) {
						cart.push({
							id: result._id,
							title: result.name,
							qty: 1,
							price: parseFloat(result.price).toFixed(2),
							image: result.image.url,
						});
					}
				} 
	req.flash('success', 'Items is successfully added in cart.');
				res.redirect('back');
			   });
			break;
		case "remove":
			var cart = keystone.session.cart;
			for (var i = 0; i < cart.length; i++) {
				if(cart[i].id ==  locals.action.product_id){
					cart.splice(i, 1);
					break;
				}
			}
			res.redirect('back');
		break;		
		case "addqty":
			var cart = keystone.session.cart;
			for (var i = 0; i < cart.length; i++) {
				if(cart[i].id ==  locals.action.product_id){
					cart[i].qty++;
                    break;
				}
			}
			res.redirect('back');
		break;		
		case "removeqty":
			var cart = keystone.session.cart;
			for (var i = 0; i < cart.length; i++) {
				if(cart[i].id ==  locals.action.product_id){
					cart[i].qty--;
                    if (cart[i].qty < 1)
                        cart.splice(i, 1);
                    break;
				}
			}
			res.redirect('back');
		break;		
		case "viewcart":
			if (keystone.session.cart && keystone.session.cart.length == 0) {
				delete keystone.session.cart;
				res.redirect('back');
			} else {
				view.render('viewcart');
			}
			break;
		default:
			console.log('update problem');
			break;

	}
};

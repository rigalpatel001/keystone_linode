var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

var User = new keystone.List('User', {
	autokey: { path: 'slug', from: 'username', unique: true }
 });

User.add({
	name: { type: Types.Name, required: true, index: true },
	username: { type: String, required: true, unique: true, index:true, default :'' },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	resetPasswordKey: { type: String, hidden: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.virtual('url').get(function() {
   return '/users'+this.slug;
 });

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();

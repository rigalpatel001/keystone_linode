var keystone = require('keystone');
var Types = keystone.Field.Types;



var Product = new keystone.List('Product', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Product.add({
  name: { type: String, required: true, initial: true},
  description: { type: Types.Html, wysiwyg: true },
  image: { type: Types.CloudinaryImage },
  price: { type: Number, default: 0, size: 'small' },
  categories: { type: Types.Relationship, ref: 'Category', index: true, many:false }
});

Product.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Product.defaultColumns = 'name, description, price';

Product.register();
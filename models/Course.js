var keystone = require('keystone');
var Types = keystone.Field.Types;

var  Course = new keystone.List('Course', {
	map: {  title: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

var Storagepath = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: keystone.expandPath('./public/uploads'),
    publicPath: './public/uploads',
  },
  schema: {
    size: true,
    mimetype: true,
    path: true,
    originalname: true,
    url: true,
    },
});

Course.add({
  title: { type: String, required: true, initial: true},
  headerimage: { type: Types.CloudinaryImage,label:'Header Image' },
  shortdescription: { type: Types.Html, wysiwyg: true},
  introsummary: { type: Types.Html, wysiwyg: true ,label:'Module Intro Summary'},
  moduledescription: { type: Types.Html, wysiwyg: true ,label:'Module Description'},
  moduleoverview: { type: Types.Html, wysiwyg: true ,label:'Module Overview Summary'},
  listoffetures: { type: Types.Html, wysiwyg: true,label:'List of futures' },
  listofbenifits: { type: Types.Html, wysiwyg: true,label:'List of Benifits' },
  benifitsFile: { type: Types.File, storage: Storagepath ,label:'Upload features & benifits file'},
  questions: { type: Types.Relationship, ref: 'Question', index: true,many:true },
  categories: { type: Types.Relationship, ref: 'Category', index: true, many:true }
  
});

Course.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Course.defaultColumns = 'title,shortdescription';

Course.register();
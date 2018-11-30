var keystone = require('keystone');
var Types = keystone.Field.Types;

var  Question = new keystone.List('Question',{
  autokey: { path: 'slug', from: 'name', unique: true }
 
});

Question.add({
  name: { type: String, required: true, initial: true,label:'Title'},
  answer1: { type: String, required: true,initial: true,label:'Answer 1'},
  answer2: { type: String, required: true,initial: true,label:'Answer 2'},
  answer3: { type: String, required: true,initial: true,label:'Answer 3'},
  answer4: { type: String, required: true,initial: true,label:'Answer 4'},
  correctanswer: { type: String, required: true,initial: true,label:'Add Correct Answer'},
});

Question.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

Question.defaultColumns = 'name,correctanswer';

Question.register();
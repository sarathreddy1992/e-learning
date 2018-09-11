/*
user.js file is to  create a schema for the users 
and store various attributes relating to the users such as
 facebook authentication,various facebook attributes and tokens
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//---------<creating a user schema with required attributes>----------
var UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true},
  facebook: String,
  tokens: Array,
  role: String,
  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  //-------Courses that user is teaching-------------
  coursesTeach: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course'}
  }],


  //--------Courses that user is taking-------------
  coursesTaken: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course'}
  }],

  revenue: [{
    money: Number
  }]
});

//---------<Exporting the entire schema so that it could be used in other files>----------
module.exports = mongoose.model('User', UserSchema);

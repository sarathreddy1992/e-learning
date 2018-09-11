/*-
Creating a schema for the courses 
used an array because each course is owned by many students
*/



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
  title: String,
  desc: String,
  wistiaId: String,
  price: Number,
  ownByTeacher: { type: Schema.Types.ObjectId, ref: 'User'},
  ownByStudent: [{
    user: { type: Schema.Types.ObjectId, ref: 'User'},
  }],
  totalStudents: Number
});

//--------module to export database---------
module.exports = mongoose.model('Course', CourseSchema);

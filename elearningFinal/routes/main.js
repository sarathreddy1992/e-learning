/*
async library is required to manage all the async calls and their callbacks 

*/

var Course = require('../models/course');
var User = require('../models/user');

var async = require('async');

module.exports = function(app) {
  //---------<Get request to the server to display the home page>----------------
  app.get('/', function(req, res, next) {
    res.render('main/home');
  });

  //---------<Get request to display the courses>-----------
  app.get('/courses', function(req, res, next) {
    Course.find({}, function(err, courses) {
      res.render('courses/courses', { courses: courses });
    });
  });

  //----------<Get request to display the most popular courses>----------
  app.get('/mostpopular', function(req, res, next) {
    Course.find({}, function(err, courses) {
      res.render('courses/mostpopular', { courses: courses });
    });
  });

  //--------Get request to display the courses which the user has enrolled for
  app.get('/courses/:id', function(req, res, next) {
    //---------Async.parallel is to support the databases operations parallely
    async.parallel([
      function(callback) {

        Course.findOne({ _id: req.params.id })
        .populate('ownByStudent.user')
        .exec(function(err, foundCourse) {
          callback(err, foundCourse);
        });
      },
      //--------Find the user who has enrolled for this course
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTaken.course': req.params.id})
        .populate('coursesTaken.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        });
      },

      //---------Find the user who teaches this course 
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTeach.course': req.params.id})
        .populate('coursesTeach.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        });
      },
    ], function(err, results) {
      var course = results[0];
      var userCourse = results[1];
      var teacherCourse = results[2];
      if (userCourse === null && teacherCourse === null) {
        res.render('courses/courseDesc', { course: course });
      } else if (userCourse === null && teacherCourse != null) {
        res.render('courses/course', { course: course ,userCourse:userCourse, teacherCourse:teacherCourse });
      } else {
        res.render('courses/course', { course: course ,userCourse:userCourse, teacherCourse:teacherCourse });
      }
    });
  });


}

/*
module to hold the details of the teacher
A user can only become a teacher only when the user creates a new 
course

Creating a schema for the user to become an instructor

whenever the waterfall is used it means the second function is always dependednt on the first 
function
*/

var User = require('../models/user');
var Course = require('../models/course');

var async = require('async');

module.exports = function(app) {
  //--------route is used whenever we have more than 1 http methods connected to a single URL
  
  app.route('/become-an-instructor')
  
  //-----chaining method by rendering a web page of becoming the instructor-----------
    .get(function(req, res, next) {
      res.render('teacher/become-instructor');
    })
    //---------Creating a new course object and saving it to the database---------
    .post(function(req, res, next) {
      async.waterfall([
        function(callback) {
          var course = new Course();
          course.title = req.body.title;
          course.save(function(err) {
            callback(err, course);
          });
        },


        //--------When a user posts a new course the webpage is redirected to teacher URL-------
        function(course, callback) {
          User.findOne({_id: req.user._id}, function(err, foundUser) {
            foundUser.role = "teacher";
            foundUser.coursesTeach.push({ course: course._id });
            foundUser.save(function(err) {
              if (err) return next(err);
              res.redirect('/teacher/dashboard');
            });
          });
        }
      ]);
    });

    //----------Get request to open teacher page------------
    app.get('/teacher/dashboard', function(req, res, next) {
      User.findOne({ _id: req.user._id })
      .populate('coursesTeach.course')
      .exec(function(err, foundUser) {
        res.render('teacher/teacher-dashboard', { foundUser: foundUser });
      });

    });

    //------------Chaining method using route to create a course and to redirect the web page to it----------
    app.route('/create-course')

      .get(function(req, res, next) {
        res.render('teacher/create-course');
      })

      //------Creating a course and saving it in the database---------
      .post(function(req, res, next) {
        async.waterfall([
          function(callback) {
            var course = new Course();
            course.title = req.body.title;
            course.price = req.body.price;
            course.desc = req.body.desc;
            course.wistiaId = req.body.wistiaId;
            course.ownByTeacher = req.user._id;
            course.save(function(err) {
              callback(err, course);
            });
          },

          function(course, callback) {
            User.findOne({_id: req.user._id}, function(err, foundUser) {
              foundUser.coursesTeach.push({ course: course._id });
              foundUser.save(function(err) {
                if (err) return next(err);
                res.redirect('/teacher/dashboard');
              });
            });
          }
        ]);
      });


      //-----------Chaining method to edit an existing course----------
      app.route('/edit-course/:id')

        .get(function(req, res, next) {
          Course.findOne({ _id: req.params.id }, function(err, foundCourse) {
            res.render('teacher/edit-course', { course: foundCourse });
          });
        })


        //---------Editing a course and savining it in the database
        .post(function(req, res, next) {
          Course.findOne({ _id: req.params.id }, function(err, foundCourse) {
            if (foundCourse) {
              if (req.body.title) foundCourse.title = req.body.title;
              if (req.body.wistiaId) foundCourse.wistiaId = req.body.wistiaId;
              if (req.body.price) foundCourse.price = req.body.price;
              if (req.body.desc) foundCourse.desc = req.body.desc;

              foundCourse.save(function(err) {
                if (err) return next(err);
                res.redirect('/teacher/dashboard');
              });
            }
          });
        });


        //---------Get requet for the revenue report------------
        app.get('/revenue-report', function(req, res, next) {
          var revenue = 0;
          User.findOne({ _id: req.user._id }, function(err, foundUser) {
            foundUser.revenue.forEach(function(value) {
              revenue += value;
            });

            res.render('teacher/revenue-report', { revenue: revenue });
          });
        });





}

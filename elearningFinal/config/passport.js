/*
passport is library to authenticate the users
passport-facebook is an extension to support the facebook authentication to the users
async library is required to manage all the async calls and their callbacks 
request is a an API library to make calls to the endpoints (mailchimp server)
*/


var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require('../config/secret');
var async = require('async');
var request = require('request');

var User = require('../models/user');

//----------Function to serialize the userid in the session----------
passport.serializeUser(function(user, done) {
  done(null, user._id);
});


//---------Function to desearlize the userid from the session to access the mongodb-------------
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//-----------Middleware of facebook stratergy for the users to login----------
passport.use(new FacebookStrategy(secret.facebook, function(req, token, refreshToken, profile, done) {
  User.findOne({ facebook: profile.id }, function(err, user) {
    if (err) return done(err);
    //---------Displaying the flash message when the user logs in again by collecting the data from the session-----
    if (user) {
      req.flash('loginMessage', 'Successfully login with facebook');
      return done(null, user);
    } else {

      
      async.waterfall([
        function(callback) {
          var newUser = new User();
          newUser.email = profile._json.email;
          newUser.facebook = profile.id;
          newUser.tokens.push({ kind: 'facebook', token: token });
          newUser.profile.name = profile.displayName;
          newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

          //---------Saving the user when logged in for the first time-------------
          newUser.save(function(err) {
            if (err) throw err;
            req.flash('loginMessage', 'Successfully login with facebook');
            callback(err, newUser)
          });
        },
        //--------After the user logins for the first time keep his email id in the mailchimp
        function(newUser, callback) {
          //Mailchimp request
          request({
            url: 'https://us18.api.mailchimp.com/3.0/lists/82c6b4e15b/members',
            method: 'POST',
            headers: {
              'Authorization':'randomUser 8b0e5b6d59e415447de9417b8cce0f03-us18',
              'Content-Type': 'application/json'
            },
            json: {
              'email_address': newUser.email,
              'status': 'subscribed'
            }

          }, function(err, response, body) {
            
            if (err) {
              return done(err, newUser);
            } else {
              console.log("Success");
              return done(null, newUser);
            }
          });
        }
      ]);

    }
  });
}));

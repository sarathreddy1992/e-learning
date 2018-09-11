/*
Express framework to use all the http methods(get, post, put , delete)
Body Parser to retreive data from the body of the web page whenever a user inputs any data in the field
morgan is to read the http requests made by the user to the server
mongoose is a object relatioanl mapper, the main funcationality of this framework is to connect directly to the mongodb
ejs and ejs-mate is to render data from the html files
passport is an authentication library
passport -facebook is an authentication library that will only focus on the facebook authentication
express-session is to store the users details of a particular session
cookie-parser is to store the users data in session so that users details like image will be persisting in all the webpages
connect-mongo is to store the session data in the database
express-flash is to display a success message when the user successfully logs in
*/


var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var ejs = require('ejs');
var engine = require('ejs-mate');
var passport = require('passport');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');


//-------<Intialize the express fun in a variable "app">-----------
var app = express();

//---------Require to request  values from the secret.js file 
var secret = require('./config/secret');

const https = require("https"),
  fs = require("fs");

const options = {
  key: fs.readFileSync("key.pem","utf8"),
  cert: fs.readFileSync("server.crt","utf8")
};

//--------<Connecting the nodejs to the mongodb>---------------
mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

//-------<Adding middlewares>--------------
app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
//-------Middleware to store the session details-------------
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});


//-----------<"Require" to request functions from the respective files>-----------
require('./routes/main')(app);
require('./routes/user')(app);
require('./routes/teacher')(app);
require('./routes/payment')(app);


//----------<connecting the port 8082 to the web server to listen>----------
app.listen(secret.port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Running on port " + secret.port);
  }
});

https.createServer(options, app).listen(8082);

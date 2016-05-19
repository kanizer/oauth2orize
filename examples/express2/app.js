/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , site = require('./site')
  , oauth2 = require('./oauth2')
  , user = require('./user')
  , util = require('util')


// Express configuration

var app = express.createServer();
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
/*
app.use(function(req, res, next) {
  console.log('-- session --');
  console.dir(req.session);
  //console.log(util.inspect(req.session, true, 3));
  console.log('-------------');
  next()
});
*/
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


// Passport configuration

require('./auth');


app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize',
  // spoof req'd query params
  function(req, res, next) {
    req.query.response_type = 'code';
    req.query.client_id = 'abc123';
    req.query.redirect_uri = '/dialog/authorize/grant'; // where a grant response redirects to

    next();
  },
  oauth2.authorization);

app.get('/dialog/authorize/grant',

  // function(req, res, done) {
  //   console.log('app.js: req.query.code:', req.query.code);
  // }

  oauth2.grant

);



app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token',
  // spoof req'd query params
  function(req, res, next) {
    // add client creds to `Authorization` header
    // req.body.client_id = 'abc123';
    // req.body.client_secret = 'ssh-secret';

    req.body.redirect_uri = '/dialog/authorize/grant'; // where a grant response redirects to
    req.body.grant_type = 'authorization_code';
    // req.query.code = req.body.code; // required but passed in from form

    next();
  },
  oauth2.token
  // TODO - NEED TO CONSUME AND CACHE ACCESS TOKEN ON CLIENT SIDE COOKIE (ALREADY STORED IN MODEL HERE - COULD CONVERT TO MEMORY VS. MONGODB STORE)
);




// {"access_token":"2Qg0hmntE8dyXftZ6AMc3dcPZt85T03huOLyGwcezO4SX4KeOdAomifC7j22Iq9xAkbxuI00lOLS9OlLea7ema4Lvsx6y1RVkI5Z9DamL5giuakIONovhFzbgZHFCihEUCroTooFSlT9sMmn6msvblXiaqQXolHi2TmzcejRAtPPP4XhRvKkPe7OOt2w24uEnE6IEfBWp08QuHaqJGf63RCoWk2ePXPvu4k0Vp21OKdOMEKcwldF8bpnCZ0vBeRv","token_type":"bearer"}

app.get('/api/userinfo',
  // spoof req'd query params
  function(req, res, next) {

    // var token = "2Qg0hmntE8dyXftZ6AMc3dcPZt85T03huOLyGwcezO4SX4KeOdAomifC7j22Iq9xAkbxuI00lOLS9OlLea7ema4Lvsx6y1RVkI5Z9DamL5giuakIONovhFzbgZHFCihEUCroTooFSlT9sMmn6msvblXiaqQXolHi2TmzcejRAtPPP4XhRvKkPe7OOt2w24uEnE6IEfBWp08QuHaqJGf63RCoWk2ePXPvu4k0Vp21OKdOMEKcwldF8bpnCZ0vBeRv";
    // req.headers['Authorization'] = 'Bearer ' + token;


    // TODO - PASS TOKEN AS PARAM WITH REQUEST FROM CLIENT


    req.body.access_token = token;

    next();
  },

  user.info);


app.listen(3000);

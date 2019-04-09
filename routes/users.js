var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../models/authenticate');

router.use(bodyParser.json());

/* GET users listing. */
router.get('', authenticate.verifyUser , authenticate.verifyAdmin , (req, res, next) => {

User.find().then((user) => {
  if (user != null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }
  else {
      err = new Error('users not found');
      err.status = 404;
      return next(err);
  }
}, (err) => next(err))
.catch((err) => next(err));


});
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      //  construct a json object with the error as the value for the error property in there and then send this back.
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});
/*
when the router post comes in on the login endpoint, we will first call the passport authenticate local. If this is successful then this will come
in and the next function that follows will be executed. If there is any error in the authentication, this passport authenticate local will automatically 
send back a reply to the client about the failure of the authentication
*/
router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;

// configuration file for authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
/*
we are doing body-parser so that'll be added into the body of the message and then from there passport we'll retrieve that and then use that and supply 
the username and password as parameters to the verify function that we will supply to the LocalStrategy
*/
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*
These two functions they serialize user and deserialize user are provided on the user schema and model by the use of the passport-local-mongoose
plugin here
*/
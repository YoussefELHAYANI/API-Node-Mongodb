// configuration file for authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('../config');
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
//  helps us to create the JSON Web Token 
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
// this option specifies how the jsonwebtoken should be extracted from the incoming request message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
    }else{
        next(err);
    }
}
exports.verifyUser = passport.authenticate('jwt', {session: false});
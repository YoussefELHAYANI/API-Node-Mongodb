var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


// field username/password added by passportLocalMongosse
var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});

/* Before passport
var User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    admin:   {
        type: Boolean,
        default: false
    }
});*/

// this will automatically as I said adding support for username and hashed storage of the password using the hash and salt
// and adding additional methods on the user schema and the model which are useful for passport authentication
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
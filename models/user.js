const mongoose = require('mongoose');
const PassportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: String
});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const PassportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
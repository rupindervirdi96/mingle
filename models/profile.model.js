const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    name: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    status: {
        type: String,
        default: "Hi There"
    },
    birthdate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }],
    education: [
        {
            degree: { type: String },
            institute: { type: String },
            location: { type: String },
            from: { type: Number },
            to: { type: Number },
        }
    ]
})

module.exports = Profile = mongoose.model('profile', ProfileSchema);
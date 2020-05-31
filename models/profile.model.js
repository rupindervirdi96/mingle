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
        type: String,
        default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
    },
    coverPic: {
        type: String,
        default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
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
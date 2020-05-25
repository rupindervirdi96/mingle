const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'profile' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'profile' },
    text: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = Message = mongoose.model('message', MessageSchema)
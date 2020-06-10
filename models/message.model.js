const mongoose = require('mongoose');


const message = new mongoose.Schema({

    sender: { type: String },
    receiver: { type: String },
    text: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
}
)

module.exports = Message = mongoose.model('message', message)
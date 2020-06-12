const mongoose = require('mongoose');


const ChatRoomSchema = new mongoose.Schema({
    messages: [
        {
        }
    ]
}
)


module.exports = ChatRoom = mongoose.model('chatroom', ChatRoomSchema);


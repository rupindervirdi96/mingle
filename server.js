const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);





connectDB();

app.use(express.json({ extended: false }));
app.use(cors())



io.on('connection', (socket) => {
    socket.on('input chat message', async (data) => {
        try {
            const profile = await Profile.findOne({ user: data.userid });
            const friendsProfile = await Profile.findOne({ _id: data.id })
            var message = new Message({ sender: profile._id, text: data.text });
            var roomId;
            profile.chats.forEach((chat) => {
                if (chat.friendsProfile == friendsProfile._id.toString()) {
                    roomId = chat.roomId;
                }
            })

            var room = await ChatRoom.findOne({
                _id: roomId
            });
            if (room) {
                room.messages.push(message);
                room.save();
            }
            var data = {
                id: friendsProfile._id.toString(), messages: room.messages
            }
            io.emit('output chat message', data)

        }
        catch (error) {
            res.json(error.message)
        }
    }
    )

});


const PORT = process.env.PORT || 5000;



app.use('/users', require('./routes/user.route'));
app.use('/posts', require('./routes/post.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/profile', require('./routes/profile.route'));
app.use('/messages', require('./routes/message.route'));




server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
})
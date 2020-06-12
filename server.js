const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const connectDB = require('./config/db');
var cors = require('cors');
// /const proxy = require('express-http-proxy');





connectDB();

app.use(express.json({ extended: false }));
app.use(cors())


const PORT = process.env.PORT || 5000;

// app.use('/__webpack_hmr', proxy({ ws: true, target: 'http://localhost:5000' }));
io.on('connection', (socket) => {
    console.log("User Connected");
    socket.on('disconnect', () => {
        console.log("User Left");
    })
});


app.use('/users', require('./routes/user.route'));
app.use('/posts', require('./routes/post.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/profile', require('./routes/profile.route'));
app.use('/messages', require('./routes/message.route'));




server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
})
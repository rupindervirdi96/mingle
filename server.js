const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const connectDB = require('./config/db');
var cors = require('cors');





connectDB();

app.use(express.json({ extended: false }));
app.use(cors())


const PORT = process.env.PORT || 5000;


app.use('/users', require('./routes/user.route'));
app.use('/posts', require('./routes/post.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/profile', require('./routes/profile.route'));
app.use('/message', require('./routes/profile.route'));




server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
})
const express = require('express');
const app = express();
const connectDB = require('./config/db');

app.get("/", (req, res) => {
    res.send('API running');

})

connectDB();

//Init middleware

app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use('/users', require('./routes/user.route'));
app.use('/posts', require('./routes/post.route'));
app.use('/auth', require('./routes/auth.route'));

app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
})
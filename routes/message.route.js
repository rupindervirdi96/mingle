const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');


router.get('/', (req, res) => {
    console.log("hoolalalaaa");
})

module.exports = router;
const express = require('express');
const router = express.Router();

//route   posts/
//desc    postRoute
//access  public

router.get('/', (req, res) => { res.send("Post route") })

module.exports = router;
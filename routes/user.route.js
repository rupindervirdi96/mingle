const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/nodemailer");

//route   users/
//desc    register
//access  public
router.post("/", async (req, res) => {
  const { name, email, password, birthdate, gender } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ error: "User already exists" });
    }
    if (password.length < 8) {
      return res.json({ error: "Password should be more than 8 character" });
    }

    const user = new User({ email, password });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };
    const profile = new Profile({
      name: name,
      user: user.id,
      birthdate: birthdate,
      gender: gender,
    });
    await profile.save();

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({
          token: token,
          msg: "You are registered! Now Login to continue",
        });
      }
    );
  } catch (error) {
    return res.status(400).json({ errors: error.message });
  }
});

//route   users/
//desc    confirmEmail
//access  public
router.post("/verify", async (req, res) => {
  const { email } = req.body;
  let secretCode = "";
  for (let i = 0; i < 6; i++) {
    secretCode += Math.floor(Math.random() * 9);
  }
  sendEmail(email, secretCode);
  res.json({ secretCode: secretCode });
});

module.exports = router;

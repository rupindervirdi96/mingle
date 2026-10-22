const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const EmailCode = require("../models/emailCode.model");
const settings = require("../config/settings");
const { sendVerificationCode } = require("../services/nodemailer");
const { ownProfile, getMyProfile } = require("../lib/profiles");
const { badRequest, HttpError } = require("../lib/errors");

const router = express.Router();

const CODE_TTL_MS = 15 * 60 * 1000;
const RESEND_AFTER_MS = 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
// Accounts created by the original app kept the email's original casing.
const findUserByEmail = (email) =>
  User.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, "i") });

const signToken = (userId) =>
  jwt.sign({ user: { id: userId.toString() } }, config.get("jwtSecret"), {
    expiresIn: "30d",
  });

// route   GET /api/auth/config
// desc    Public settings the client needs before signing in
router.get("/config", (req, res) => {
  res.json({
    emailVerification: settings.emailVerificationEnabled(),
    cloudinary: settings.cloudinary,
  });
});

// route   POST /api/auth/send-code
// desc    Email a one-time signup code
router.post("/send-code", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!EMAIL_RE.test(email)) throw badRequest("Please enter a valid email address.");
  if (!settings.emailVerificationEnabled()) {
    return res.json({ sent: false, verificationRequired: false });
  }
  if (await findUserByEmail(email)) {
    throw badRequest("An account with this email already exists. Try logging in.");
  }

  const existing = await EmailCode.findOne({ email });
  if (existing && Date.now() - existing.sentAt.getTime() < RESEND_AFTER_MS) {
    throw new HttpError(429, "Please wait a minute before requesting another code.");
  }

  const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
  await EmailCode.findOneAndUpdate(
    { email },
    {
      email,
      codeHash: await bcrypt.hash(code, 8),
      attempts: 0,
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
    },
    { upsert: true }
  );

  try {
    await sendVerificationCode(email, code);
  } catch (error) {
    console.error("Verification email failed:", error.message);
    await EmailCode.deleteOne({ email });
    throw new HttpError(502, "We couldn't send the verification email. Please try again later.");
  }
  res.json({ sent: true, verificationRequired: true });
});

// route   POST /api/auth/register
// desc    Create an account and its profile
router.post("/register", async (req, res) => {
  const { password, birthdate, gender, code } = req.body;
  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);

  if (name.length < 2) throw badRequest("Please enter your name.");
  if (!EMAIL_RE.test(email)) throw badRequest("Please enter a valid email address.");
  if (!password || password.length < 8) {
    throw badRequest("Password must be at least 8 characters.");
  }
  const birth = new Date(birthdate);
  if (!birthdate || Number.isNaN(birth.getTime()) || birth > new Date()) {
    throw badRequest("Please enter a valid birthday.");
  }
  if (!["Male", "Female", "Other"].includes(gender)) {
    throw badRequest("Please choose a gender.");
  }
  if (await findUserByEmail(email)) {
    throw badRequest("An account with this email already exists. Try logging in.");
  }

  if (settings.emailVerificationEnabled()) {
    const record = await EmailCode.findOne({ email });
    if (!record || record.expiresAt < new Date()) {
      throw badRequest("Your code has expired. Please request a new one.");
    }
    if (record.attempts >= MAX_CODE_ATTEMPTS) {
      throw badRequest("Too many attempts. Please request a new code.");
    }
    const valid = await bcrypt.compare(String(code || ""), record.codeHash);
    if (!valid) {
      record.attempts += 1;
      await record.save();
      throw badRequest("That code isn't right. Check your email and try again.");
    }
    await EmailCode.deleteOne({ email });
  }

  const user = await User.create({
    email,
    password: await bcrypt.hash(password, 10),
  });
  let profile;
  try {
    profile = await Profile.create({ user: user._id, name, birthdate: birth, gender });
  } catch (error) {
    await User.deleteOne({ _id: user._id });
    throw error;
  }

  res.status(201).json({ token: signToken(user._id), profile: ownProfile(profile) });
});

// route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;
  if (!email || !password) throw badRequest("Please enter your email and password.");

  const user = await findUserByEmail(email);
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) throw badRequest("Incorrect email or password.");

  const profile = await Profile.findOne({ user: user._id });
  if (!profile) throw badRequest("This account has no profile. Please sign up again.");

  res.json({ token: signToken(user._id), profile: ownProfile(profile) });
});

// route   GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  res.json(ownProfile(await getMyProfile(req)));
});

module.exports = router;

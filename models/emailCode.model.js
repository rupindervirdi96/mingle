const mongoose = require("mongoose");

// One-time signup verification codes. The code itself is stored hashed and
// MongoDB removes the document automatically once it expires.
const EmailCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  codeHash: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});

module.exports = mongoose.model("emailcode", EmailCodeSchema);

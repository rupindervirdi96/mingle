const mongoose = require("mongoose");

// `profile` stays a String (the author's profile id) for compatibility with existing posts.
// `name` and `profPic` are a snapshot taken at creation; reads hydrate fresh author data.
const PostSchema = new mongoose.Schema({
  profile: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  profPic: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  text: {
    type: String,
    trim: true,
    default: "",
  },
  likes: [{ type: Object }],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model("post", PostSchema);

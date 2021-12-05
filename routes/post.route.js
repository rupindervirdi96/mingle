const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");
const Profile = require("../models/profile.model");
const auth = require("../middleware/auth");

//route   posts/
//desc    createPost
//access  public
router.post("/", auth, async (req, res) => {
  const { text, image } = req.body;
  try {
    const profilee = await Profile.findOne({ user: req.user.id });
    let post = "";
    if (!image) {
      post = new Post({
        profile: profilee.id,
        profPic: profilee.profilePic,
        name: profilee.name,
        text,
      });
    } else {
      post = new Post({
        profile: profilee.id,
        profPic: profilee.profilePic,
        name: profilee.name,
        text,
        image,
      });
    }
    await post.save();
    res.json(post);
  } catch (error) {
    console.log(error);
  }
});

//route   posts/getMyPosts
//desc    getMyPosts
//access  public
router.get("/", auth, async (req, res) => {
  const profile = await Profile.findOne({
    user: req.user.id,
  });
  const posts = await Post.find({ profile: profile._id });
  res.json(posts);
});

//route   posts/getPost/:id
//desc    getPostsForAnyUser
//access  public
router.get("/getpost/:id", async (req, res) => {
  const posts = await Post.find({ profile: req.params.id });
  res.json(posts);
});

//route   posts/
//desc    getAllPostsForFriends
//access  public
router.get("/friends", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  const friendsIds = [];
  if (profile.contacts.friends.length > 0) {
    profile.contacts.friends.forEach((friend) => {
      friendsIds.push(friend.id);
    });
  }
  const AllPosts = await Post.find();
  const requiredPosts = [];
  AllPosts.forEach((post) => {
    if (friendsIds.includes(post.profile) || post.profile == profile._id) {
      requiredPosts.push(post);
    }
  });
  res.json(requiredPosts);
});

//route   posts/like/:id
//desc    addLikes
//access  public
router.post("/like/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const post = await Post.findOne({
      _id: req.params.id,
    });

    if (post.likes.length == 0) {
      console.log("was empty");
      post.likes.push(profile._id);
      await post.save();
      return res.json({ post: post, profile: profile._id });
    } else {
      let check = false;
      let counter = -1;
      post.likes.forEach(async (like) => {
        counter += 1;
        if (like.toString() === profile._id.toString()) {
          console.log("remove");
          post.likes.splice(counter, 1);
          check = true;
          return res.json({ post: post, profile: profile._id });
        }
      });
      if (!check) {
        post.likes.push(profile._id);
        return res.json({ post: post, profile: profile._id });
      }
    }
    await post.save();
  } catch (error) {
    res.json({ msg: error.message });
  }
});

module.exports = router;

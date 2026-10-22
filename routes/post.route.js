const express = require("express");
const auth = require("../middleware/auth");
const Post = require("../models/post.model");
const Notification = require("../models/notification.model");
const { getMyProfile, friendIds, summariesById } = require("../lib/profiles");
const { notify, retract } = require("../lib/notify");
const { emitToMany } = require("../lib/realtime");
const { badRequest, forbidden, notFound } = require("../lib/errors");

const router = express.Router();
router.use(auth);

const PAGE_SIZE = 10;

const serialize = (post, profiles, meId) => {
  const likes = [...new Set((post.likes || []).map(String))];
  const fallback = { _id: post.profile, name: post.name, profilePic: post.profPic };
  return {
    _id: post._id.toString(),
    author: profiles.get(String(post.profile)) || fallback,
    text: post.text || "",
    image: post.image || null,
    date: post.date,
    likes,
    likeCount: likes.length,
    liked: likes.includes(meId),
    comments: (post.comments || []).map((c) => ({
      _id: c._id.toString(),
      author: profiles.get(String(c.user)) || { _id: String(c.user), name: "Mingle user" },
      text: c.text,
      time: c.time,
    })),
  };
};

// Serializes posts with fresh author and commenter names/photos in one lookup.
const serializeAll = async (posts, meId) => {
  const ids = posts.flatMap((p) => [p.profile, ...(p.comments || []).map((c) => c.user)]);
  const profiles = await summariesById(ids);
  return posts.map((p) => serialize(p, profiles, meId));
};

const page = async (filter, req, meId) => {
  const before = req.query.before ? new Date(req.query.before) : null;
  if (before && !Number.isNaN(before.getTime())) filter.date = { $lt: before };
  const posts = await Post.find(filter).sort({ date: -1 }).limit(PAGE_SIZE + 1);
  return {
    posts: await serializeAll(posts.slice(0, PAGE_SIZE), meId),
    hasMore: posts.length > PAGE_SIZE,
  };
};

const loadPost = async (id) => {
  const post = await Post.findById(id);
  if (!post) throw notFound("This post doesn't exist anymore.");
  return post;
};

// route   GET /api/posts/feed?before=
// desc    Your posts and your friends' posts, newest first
router.get("/feed", async (req, res) => {
  const me = await getMyProfile(req);
  const authors = [me._id.toString(), ...friendIds(me)];
  res.json(await page({ profile: { $in: authors } }, req, me._id.toString()));
});

// route   GET /api/posts/user/:profileId?before=
router.get("/user/:profileId", async (req, res) => {
  const me = await getMyProfile(req);
  res.json(await page({ profile: String(req.params.profileId) }, req, me._id.toString()));
});

// route   GET /api/posts/:id
router.get("/:id", async (req, res) => {
  const [me, post] = await Promise.all([getMyProfile(req), loadPost(req.params.id)]);
  const [serialized] = await serializeAll([post], me._id.toString());
  res.json(serialized);
});

// route   POST /api/posts
router.post("/", async (req, res) => {
  const me = await getMyProfile(req);
  const text = String(req.body.text || "").trim();
  const image = req.body.image ? String(req.body.image) : undefined;
  if (!text && !image) throw badRequest("Write something or add a photo.");
  if (text.length > 5000) throw badRequest("Posts can be up to 5000 characters.");
  if (image && !/^https?:\/\/\S+$/i.test(image)) throw badRequest("That image link isn't valid.");

  const post = await Post.create({
    profile: me._id.toString(),
    name: me.name,
    profPic: me.profilePic,
    text,
    image,
  });
  const [serialized] = await serializeAll([post], me._id.toString());
  emitToMany(friendIds(me), "post:new", serialized);
  res.status(201).json(serialized);
});

// route   DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  const [me, post] = await Promise.all([getMyProfile(req), loadPost(req.params.id)]);
  if (post.profile !== me._id.toString()) throw forbidden("You can only delete your own posts.");
  await post.deleteOne();
  await Notification.deleteMany({ post: post._id });
  res.json({ _id: post._id.toString() });
});

// route   POST /api/posts/:id/like
// desc    Toggle your like
router.post("/:id/like", async (req, res) => {
  const [me, post] = await Promise.all([getMyProfile(req), loadPost(req.params.id)]);
  const meId = me._id.toString();
  const liked = post.likes.some((like) => String(like) === meId);

  // Older likes may be stored as ObjectIds rather than strings, so pull both forms.
  const update = liked
    ? { $pull: { likes: { $in: [meId, me._id] } } }
    : { $addToSet: { likes: meId } };
  const updated = await Post.findByIdAndUpdate(post._id, update, { new: true });

  if (liked) {
    await retract({ type: "post_like", actor: me._id, post: post._id });
  } else {
    await notify({ recipient: post.profile, actor: me._id, type: "post_like", post: post._id });
  }
  const [serialized] = await serializeAll([updated], meId);
  res.json(serialized);
});

// route   POST /api/posts/:id/comments
router.post("/:id/comments", async (req, res) => {
  const me = await getMyProfile(req);
  const text = String(req.body.text || "").trim();
  if (!text) throw badRequest("Write a comment first.");
  if (text.length > 1000) throw badRequest("Comments can be up to 1000 characters.");

  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { user: me._id, text } } },
    { new: true }
  );
  if (!updated) throw notFound("This post doesn't exist anymore.");

  await notify({
    recipient: updated.profile,
    actor: me._id,
    type: "post_comment",
    post: updated._id,
    text: text.slice(0, 120),
  });
  const [serialized] = await serializeAll([updated], me._id.toString());
  res.status(201).json(serialized);
});

// route   DELETE /api/posts/:id/comments/:commentId
// desc    Comment authors and post owners can delete comments
router.delete("/:id/comments/:commentId", async (req, res) => {
  const [me, post] = await Promise.all([getMyProfile(req), loadPost(req.params.id)]);
  const meId = me._id.toString();
  const comment = post.comments.id(req.params.commentId);
  if (!comment) throw notFound("This comment doesn't exist anymore.");
  if (String(comment.user) !== meId && post.profile !== meId) {
    throw forbidden("You can't delete this comment.");
  }
  comment.deleteOne();
  await post.save();
  const [serialized] = await serializeAll([post], meId);
  res.json(serialized);
});

module.exports = router;

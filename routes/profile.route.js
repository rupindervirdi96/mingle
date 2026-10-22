const express = require("express");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const Profile = require("../models/profile.model");
const Post = require("../models/post.model");
const {
  summary,
  ownProfile,
  getMyProfile,
  friendIds,
  relationship,
  summariesById,
  SUMMARY_FIELDS,
} = require("../lib/profiles");
const { isOnline } = require("../lib/realtime");
const { badRequest, notFound } = require("../lib/errors");

const router = express.Router();
router.use(auth);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isImageUrl = (value) => /^https?:\/\/\S+$/i.test(value);

// Which fields each kind of intro entry accepts, and whether only one may exist.
const INFO_TYPES = {
  work: { fields: ["position", "company", "location", "start", "end"], single: false },
  education: { fields: ["course", "institute", "location", "start", "end"], single: false },
  location: { fields: ["city", "country"], single: true },
  relation: { fields: ["rel"], single: true },
};

// route   GET /api/profiles/search?q=
router.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  const me = await getMyProfile(req);
  const results = await Profile.find({
    _id: { $ne: me._id },
    name: new RegExp(escapeRegex(q), "i"),
  })
    .select(SUMMARY_FIELDS)
    .limit(20);
  res.json(
    results.map((p) => ({
      ...summary(p),
      relationship: relationship(me, p._id),
      online: isOnline(p._id),
    }))
  );
});

// route   PATCH /api/profiles/me
// desc    Update name, status, profile picture or cover picture
router.patch("/me", async (req, res) => {
  const me = await getMyProfile(req);
  const { name, status, profilePic, coverPic } = req.body;

  if (name !== undefined) {
    const trimmed = String(name).trim();
    if (trimmed.length < 2 || trimmed.length > 60) {
      throw badRequest("Name must be between 2 and 60 characters.");
    }
    me.name = trimmed;
  }
  if (status !== undefined) {
    const trimmed = String(status).trim();
    if (trimmed.length > 160) throw badRequest("Bio must be 160 characters or fewer.");
    me.status = trimmed;
  }
  for (const [key, value] of Object.entries({ profilePic, coverPic })) {
    if (value === undefined) continue;
    if (!isImageUrl(value)) throw badRequest("That image link isn't valid.");
    me[key] = value;
  }

  await me.save();
  res.json(ownProfile(me));
});

// route   POST /api/profiles/me/info
// desc    Add an intro entry (work, education, location, relationship)
router.post("/me/info", async (req, res) => {
  const me = await getMyProfile(req);
  const spec = INFO_TYPES[req.body.type];
  if (!spec) throw badRequest("Unknown intro type.");

  const entry = { id: crypto.randomUUID(), type: req.body.type };
  for (const field of spec.fields) {
    const value = String(req.body[field] ?? "").trim();
    if (value) entry[field] = value.slice(0, 100);
  }
  const required = spec.fields.filter((f) => !["start", "end", "location"].includes(f));
  if (required.some((f) => !entry[f])) throw badRequest("Please fill in the required fields.");

  me.info = [
    ...(spec.single ? me.info.filter((i) => i.type !== entry.type) : me.info),
    entry,
  ];
  await me.save();
  res.json(me.info);
});

// route   DELETE /api/profiles/me/info/:index
router.delete("/me/info/:index", async (req, res) => {
  const me = await getMyProfile(req);
  const index = Number(req.params.index);
  if (!Number.isInteger(index) || index < 0 || index >= me.info.length) {
    throw notFound("That intro entry doesn't exist.");
  }
  me.info = me.info.filter((_, i) => i !== index);
  await me.save();
  res.json(me.info);
});

// route   GET /api/profiles/:id
// desc    A profile page, with how the viewer is related to it
router.get("/:id", async (req, res) => {
  const [me, profile] = await Promise.all([
    getMyProfile(req),
    Profile.findById(req.params.id),
  ]);
  if (!profile) throw notFound("This profile doesn't exist.");

  const ids = friendIds(profile);
  const listed = ids.slice(0, 200);
  const friends = await summariesById(listed);
  const myFriends = new Set(friendIds(me));
  const postCount = await Post.countDocuments({ profile: profile._id.toString() });

  res.json({
    ...summary(profile),
    coverPic: profile.coverPic,
    info: profile.info || [],
    createdAt: profile.createdAt,
    relationship: relationship(me, profile._id),
    online: isOnline(profile._id),
    friendCount: ids.length,
    mutualCount: ids.filter((id) => myFriends.has(id)).length,
    postCount,
    friends: listed
      .map((id) => ({ ...friends.get(id), online: isOnline(id) }))
      .filter((f) => f._id),
  });
});

module.exports = router;

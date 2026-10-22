const mongoose = require("mongoose");
const Profile = require("../models/profile.model");
const { notFound } = require("./errors");

const SUMMARY_FIELDS = "name profilePic status";

const summary = (p) =>
  p && {
    _id: p._id.toString(),
    name: p.name,
    profilePic: p.profilePic,
    status: p.status,
  };

// Everything the signed-in user may see about themselves.
const ownProfile = (p) => ({
  _id: p._id.toString(),
  user: p.user.toString(),
  name: p.name,
  profilePic: p.profilePic,
  coverPic: p.coverPic,
  status: p.status,
  birthdate: p.birthdate,
  gender: p.gender,
  info: p.info || [],
  createdAt: p.createdAt,
});

const getMyProfile = async (req) => {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) throw notFound("Profile not found.");
  return profile;
};

const friendIds = (profile) => [
  ...new Set((profile.contacts?.friends || []).map((f) => String(f.id))),
];

const requestsByStatus = (profile, status) =>
  (profile.contacts?.requests || []).filter((r) => r.status === status);

const relationship = (me, otherId) => {
  otherId = String(otherId);
  if (me._id.toString() === otherId) return "self";
  if (friendIds(me).includes(otherId)) return "friends";
  const request = (me.contacts?.requests || []).find(
    (r) => String(r.id) === otherId
  );
  if (request) return request.status === "received" ? "received" : "requested";
  return "none";
};

// Loads fresh name/photo for a list of profile ids. Stored copies (friends lists,
// post snapshots) go stale when people change their picture, so reads use this.
const summariesById = async (ids) => {
  const unique = [...new Set(ids.map(String))].filter(mongoose.isValidObjectId);
  const profiles = await Profile.find({ _id: { $in: unique } }).select(
    SUMMARY_FIELDS
  );
  return new Map(profiles.map((p) => [p._id.toString(), summary(p)]));
};

module.exports = {
  SUMMARY_FIELDS,
  summary,
  ownProfile,
  getMyProfile,
  friendIds,
  requestsByStatus,
  relationship,
  summariesById,
};

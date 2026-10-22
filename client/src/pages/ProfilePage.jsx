import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { Camera, Pencil, UserRoundX, Users } from "lucide-react";
import api, { errorMessage } from "../api/client";
import { useAppDispatch, useAppSelector, useMe } from "../store";
import { updateProfile } from "../store/authSlice";
import { fetchUserPosts } from "../store/postsSlice";
import { toast, toastError } from "../store/uiSlice";
import { uploadImage } from "../lib/upload";
import { Avatar, EmptyState, Modal, PageSpinner, Spinner } from "../components/ui";
import FriendButton, { useRelationship } from "../components/FriendButton";
import Intro from "../components/Intro";
import PostComposer from "../components/PostComposer";
import PostList from "../components/PostList";

function EditProfileModal({ onClose }) {
  const me = useMe();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: me.name, status: me.status || "" });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await dispatch(updateProfile({ name: form.name, status: form.status })).unwrap();
      dispatch(toast({ title: "Profile updated", tone: "success", duration: 2500 }));
      onClose();
    } catch (message) {
      dispatch(toastError(message));
      setBusy(false);
    }
  };

  return (
    <Modal title="Edit profile" onClose={onClose}>
      <form className="stack" onSubmit={save}>
        <div className="field">
          <label htmlFor="pname">Name</label>
          <input id="pname" className="input" value={form.name} minLength={2} maxLength={60} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="pbio">Bio</label>
          <textarea id="pbio" className="textarea" value={form.status} maxLength={160} placeholder="Tell people a little about yourself" onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <span className="faint" style={{ fontSize: 12, textAlign: "right" }}>
            {form.status.length}/160
          </span>
        </div>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? <Spinner size="sm" light /> : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function PhotoButton({ field, className, label }) {
  const dispatch = useAppDispatch();
  const input = useRef();
  const [busy, setBusy] = useState(false);

  const change = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      await dispatch(updateProfile({ [field]: url })).unwrap();
      dispatch(toast({ title: `${label} updated`, tone: "success", duration: 2500 }));
    } catch (error) {
      dispatch(toastError(typeof error === "string" ? error : error.message));
    }
    setBusy(false);
  };

  return (
    <>
      <button className={className} onClick={() => input.current.click()} disabled={busy} aria-label={`Change ${label.toLowerCase()}`}>
        {busy ? <Spinner size="sm" /> : <Camera />}
        {field === "coverPic" && <span>{busy ? "Uploading…" : "Edit cover"}</span>}
      </button>
      <input ref={input} type="file" accept="image/*" hidden onChange={change} />
    </>
  );
}

function FriendsGrid({ friends, limit }) {
  const shown = limit ? friends.slice(0, limit) : friends;
  return (
    <div className="friends-grid">
      {shown.map((f) => (
        <Link key={f._id} to={`/profile/${f._id}`} className="friend-tile">
          <span className="friend-tile-photo">
            <img src={f.profilePic} alt="" loading="lazy" />
          </span>
          <span className="truncate">{f.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const me = useMe();
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "posts";
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const isMe = id === me._id;
  const relationship = useRelationship(id, profile?.relationship);
  const online = useAppSelector((s) => Boolean(s.friends.online[id]));
  const posts = useAppSelector((s) => s.posts.byUser[id]);

  // Reload when the relationship changes, so counts and friend lists stay right.
  useEffect(() => {
    let cancelled = false;
    setError(null);
    api
      .get(`/profiles/${id}`)
      .then(({ data }) => !cancelled && setProfile(data))
      .catch((e) => !cancelled && setError(errorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, [id, relationship]);

  useEffect(() => {
    dispatch(fetchUserPosts({ profileId: id }));
  }, [id, dispatch]);

  const loadMore = useCallback(() => dispatch(fetchUserPosts({ profileId: id, more: true })), [id, dispatch]);

  if (error) {
    return (
      <div className="narrow">
        <div className="card">
          <EmptyState icon={UserRoundX} title="Profile not available" action={<Link to="/" className="btn btn-primary">Go home</Link>}>
            {error}
          </EmptyState>
        </div>
      </div>
    );
  }
  if (!profile || profile._id !== id) return <PageSpinner />;

  // Your own details come from the auth store so edits show immediately.
  const view = isMe ? { ...profile, ...me } : profile;
  const setTab = (t) => setParams(t === "posts" ? {} : { tab: t }, { replace: true });

  return (
    <div className="profile">
      <section className="card profile-header">
        <div className="profile-cover" style={{ backgroundImage: `url(${view.coverPic})` }}>
          {isMe && <PhotoButton field="coverPic" label="Cover photo" className="btn btn-secondary sm cover-edit" />}
        </div>
        <div className="profile-id">
          <div className="profile-avatar">
            <Avatar src={view.profilePic} name={view.name} size={152} online={!isMe && online} />
            {isMe && <PhotoButton field="profilePic" label="Profile picture" className="icon-btn filled avatar-edit" />}
          </div>
          <div className="profile-names">
            <h1>{view.name}</h1>
            <p className="muted">
              {profile.friendCount} {profile.friendCount === 1 ? "friend" : "friends"}
              {!isMe && profile.mutualCount > 0 && ` · ${profile.mutualCount} mutual`}
              {!isMe && online && <span className="online-text"> · Active now</span>}
            </p>
            {profile.friends.length > 0 && (
              <div className="avatar-stack">
                {profile.friends.slice(0, 6).map((f) => (
                  <Avatar key={f._id} src={f.profilePic} name={f.name} size={32} />
                ))}
              </div>
            )}
          </div>
          <div className="profile-actions">
            {isMe ? (
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                <Pencil /> Edit profile
              </button>
            ) : (
              <FriendButton profileId={id} name={view.name} fallback={profile.relationship} showMessage />
            )}
          </div>
        </div>
        <nav className="tabs profile-tabs">
          {[
            ["posts", "Posts"],
            ["about", "About"],
            ["friends", "Friends"],
          ].map(([key, label]) => (
            <button key={key} className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
              {label}
              {key === "friends" && profile.friendCount > 0 && <span className="count">{profile.friendCount}</span>}
            </button>
          ))}
        </nav>
      </section>

      {tab === "about" && (
        <div className="narrow">
          <Intro profile={view} isMe={isMe} extra={isMe} />
        </div>
      )}

      {tab === "friends" && (
        <div className="card card-pad">
          <div className="card-title">Friends</div>
          {profile.friends.length ? (
            <FriendsGrid friends={profile.friends} />
          ) : (
            <EmptyState icon={Users} title="No friends to show">
              {isMe ? "Find people you know on the Friends page." : `${view.name.split(" ")[0]} hasn't added any friends yet.`}
            </EmptyState>
          )}
        </div>
      )}

      {tab === "posts" && (
        <div className="profile-body">
          <aside className="profile-side stack">
            <Intro profile={view} isMe={isMe} />
            {profile.friends.length > 0 && (
              <div className="card card-pad">
                <div className="card-title">
                  Friends
                  <button onClick={() => setTab("friends")}>See all</button>
                </div>
                <FriendsGrid friends={profile.friends} limit={9} />
              </div>
            )}
          </aside>
          <section className="stack">
            {isMe && <PostComposer />}
            <PostList
              list={posts}
              onLoadMore={loadMore}
              empty={
                <EmptyState icon={Pencil} title="No posts yet">
                  {isMe ? "Share your first post with your friends." : `${view.name.split(" ")[0]} hasn't posted anything yet.`}
                </EmptyState>
              }
            />
          </section>
        </div>
      )}

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </div>
  );
}

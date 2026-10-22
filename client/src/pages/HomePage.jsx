import { useCallback, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Bell, Home, MessageCircle, User, UserPlus, Users } from "lucide-react";
import { useAppDispatch, useAppSelector, useMe } from "../store";
import { fetchSuggestions } from "../store/friendsSlice";
import { fetchFeed } from "../store/postsSlice";
import { selectUnreadChats } from "../store/chatSlice";
import { Avatar, EmptyState } from "../components/ui";
import PostComposer from "../components/PostComposer";
import PostList from "../components/PostList";
import FriendButton from "../components/FriendButton";

function ProfileCard() {
  const me = useMe();
  const friends = useAppSelector((s) => s.friends.friends.length);
  return (
    <div className="card profile-mini">
      <div className="profile-mini-cover" style={{ backgroundImage: `url(${me.coverPic})` }} />
      <Link to={`/profile/${me._id}`} className="profile-mini-body">
        <Avatar src={me.profilePic} name={me.name} size={72} ring />
        <strong>{me.name}</strong>
        <span className="muted">{me.status}</span>
      </Link>
      <div className="profile-mini-stats">
        <Link to="/friends?tab=all">
          <strong>{friends}</strong>
          <span>Friends</span>
        </Link>
        <Link to={`/profile/${me._id}`}>
          <strong>View</strong>
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
}

function Shortcuts() {
  const me = useMe();
  const requests = useAppSelector((s) => s.friends.received.length);
  const chats = useAppSelector(selectUnreadChats);
  const notifications = useAppSelector((s) => s.notifications.unread);
  const items = [
    { to: "/", label: "Home", Icon: Home, end: true },
    { to: "/friends", label: "Friends", Icon: Users, count: requests },
    { to: "/messages", label: "Messages", Icon: MessageCircle, count: chats },
    { to: "/notifications", label: "Notifications", Icon: Bell, count: notifications },
    { to: `/profile/${me._id}`, label: "Profile", Icon: User },
  ];
  return (
    <nav className="card shortcuts" aria-label="Shortcuts">
      {items.map(({ to, label, Icon, count, end }) => (
        <NavLink key={label} to={to} end={end} className="shortcut">
          <span className="shortcut-icon">
            <Icon />
          </span>
          <span className="grow">{label}</span>
          {count > 0 && <span className="pill count-pill">{count}</span>}
        </NavLink>
      ))}
    </nav>
  );
}

function Requests() {
  const received = useAppSelector((s) => s.friends.received);
  if (!received.length) return null;
  return (
    <div className="card card-pad">
      <div className="card-title">
        Friend requests <Link to="/friends">See all</Link>
      </div>
      <div className="stack" style={{ gap: 14 }}>
        {received.slice(0, 2).map((p) => (
          <div key={p._id} className="side-request">
            <Link to={`/profile/${p._id}`}>
              <Avatar src={p.profilePic} name={p.name} size={48} />
            </Link>
            <div className="grow stack" style={{ gap: 8 }}>
              <Link to={`/profile/${p._id}`} className="truncate" style={{ fontWeight: 600 }}>
                {p.name}
              </Link>
              <FriendButton profileId={p._id} name={p.name} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Contacts() {
  const { friends, online, loaded } = useAppSelector((s) => s.friends);
  const sorted = [...friends].sort((a, b) => Number(Boolean(online[b._id])) - Number(Boolean(online[a._id])));
  const onlineCount = friends.filter((f) => online[f._id]).length;

  return (
    <div className="card card-pad contacts">
      <div className="card-title">
        <span>
          Contacts {onlineCount > 0 && <span className="online-count">{onlineCount} online</span>}
        </span>
      </div>
      {loaded && !friends.length ? (
        <p className="muted" style={{ fontSize: 14 }}>
          When you add friends, you can chat with them here.
        </p>
      ) : (
        <div className="contact-list">
          {sorted.map((f) => (
            <Link key={f._id} to={`/messages/${f._id}`} className="contact" title={`Message ${f.name}`}>
              <Avatar src={f.profilePic} name={f.name} size={36} online={Boolean(online[f._id])} />
              <span className="truncate">{f.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Suggestions() {
  const dispatch = useAppDispatch();
  const { suggestions, suggestionsLoaded } = useAppSelector((s) => s.friends);
  useEffect(() => {
    if (!suggestionsLoaded) dispatch(fetchSuggestions());
  }, [suggestionsLoaded, dispatch]);
  if (!suggestions.length) return null;

  return (
    <div className="card card-pad">
      <div className="card-title">
        People you may know <Link to="/friends?tab=suggestions">See all</Link>
      </div>
      <div className="stack" style={{ gap: 12 }}>
        {suggestions.slice(0, 3).map((p) => (
          <div key={p._id} className="row">
            <Link to={`/profile/${p._id}`}>
              <Avatar src={p.profilePic} name={p.name} size={40} />
            </Link>
            <div className="grow">
              <Link to={`/profile/${p._id}`} className="truncate" style={{ display: "block", fontWeight: 600, fontSize: 14 }}>
                {p.name}
              </Link>
              <span className="faint" style={{ fontSize: 12 }}>
                {p.mutualCount ? `${p.mutualCount} mutual` : "New on Mingle"}
              </span>
            </div>
            <FriendButton profileId={p._id} name={p.name} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const feed = useAppSelector((s) => s.posts.feed);
  const friendCount = useAppSelector((s) => s.friends.friends.length);

  useEffect(() => {
    if (!feed.loaded && !feed.loading) dispatch(fetchFeed());
  }, [feed.loaded, feed.loading, dispatch]);

  const loadMore = useCallback(() => dispatch(fetchFeed({ more: true })), [dispatch]);

  return (
    <div className="home">
      <aside className="home-left">
        <ProfileCard />
        <Shortcuts />
      </aside>
      <section className="home-feed stack">
        <PostComposer />
        <PostList
          list={feed}
          onLoadMore={loadMore}
          empty={
            <EmptyState
              icon={UserPlus}
              title="Your feed is quiet"
              action={
                <Link to="/friends?tab=suggestions" className="btn btn-primary">
                  <UserPlus /> Find friends
                </Link>
              }
            >
              {friendCount
                ? "Share your first post, or wait for your friends to post something."
                : "Add some friends to see what they're sharing, or write your first post above."}
            </EmptyState>
          }
        />
      </section>
      <aside className="home-right">
        <Requests />
        <Contacts />
        <Suggestions />
      </aside>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Inbox, Search, Send, Sparkles, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchSuggestions } from "../store/friendsSlice";
import { EmptyState, PageSpinner } from "../components/ui";
import { PersonCard } from "../components/FriendButton";

export default function FriendsPage() {
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const { friends, received, sent, suggestions, loaded, suggestionsLoaded } = useAppSelector((s) => s.friends);
  const [filter, setFilter] = useState("");
  const tab = params.get("tab") || (received.length || !friends.length ? "requests" : "all");

  useEffect(() => {
    dispatch(fetchSuggestions());
  }, [dispatch]);

  const tabs = [
    { id: "requests", label: "Requests", Icon: Inbox, count: received.length },
    { id: "suggestions", label: "Suggestions", Icon: Sparkles },
    { id: "all", label: "All friends", Icon: Users, count: friends.length },
  ];

  const shownFriends = friends.filter((f) => f.name.toLowerCase().includes(filter.trim().toLowerCase()));

  return (
    <div className="friends-page">
      <header className="page-head">
        <div>
          <h1>Friends</h1>
          <p className="muted">Manage requests and find people you know.</p>
        </div>
      </header>
      <nav className="tabs card page-tabs">
        {tabs.map(({ id, label, Icon, count }) => (
          <button key={id} className={tab === id ? "on" : ""} onClick={() => setParams({ tab: id }, { replace: true })}>
            <Icon size={17} /> {label}
            {count > 0 && <span className="count">{count}</span>}
          </button>
        ))}
      </nav>

      {!loaded ? (
        <PageSpinner />
      ) : tab === "requests" ? (
        <div className="stack">
          <h2 className="section-title">Friend requests</h2>
          {received.length ? (
            <div className="people-grid">
              {received.map((p) => (
                <PersonCard key={p._id} person={p} fallback="received" subtitle="Wants to be friends" />
              ))}
            </div>
          ) : (
            <div className="card">
              <EmptyState
                icon={Inbox}
                title="No new requests"
                action={
                  <button className="btn btn-soft" onClick={() => setParams({ tab: "suggestions" })}>
                    <Sparkles /> See suggestions
                  </button>
                }
              >
                When someone sends you a friend request, it'll show up here.
              </EmptyState>
            </div>
          )}
          {sent.length > 0 && (
            <>
              <h2 className="section-title">
                <Send size={13} /> Sent requests
              </h2>
              <div className="people-grid">
                {sent.map((p) => (
                  <PersonCard key={p._id} person={p} fallback="requested" subtitle="Request sent" />
                ))}
              </div>
            </>
          )}
        </div>
      ) : tab === "suggestions" ? (
        !suggestionsLoaded ? (
          <PageSpinner />
        ) : suggestions.length ? (
          <div className="people-grid">
            {suggestions.map((p) => (
              <PersonCard key={p._id} person={p} />
            ))}
          </div>
        ) : (
          <div className="card">
            <EmptyState icon={Sparkles} title="No suggestions right now">
              You've connected with everyone we know about. Invite your friends to join Mingle!
            </EmptyState>
          </div>
        )
      ) : (
        <div className="stack">
          {friends.length > 6 && (
            <div className="input-icon friends-filter">
              <Search />
              <input className="input" placeholder="Search friends" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
          )}
          {friends.length ? (
            <div className="people-grid">
              {shownFriends.map((p) => (
                <PersonCard key={p._id} person={p} fallback="friends" />
              ))}
            </div>
          ) : (
            <div className="card">
              <EmptyState
                icon={Users}
                title="No friends yet"
                action={
                  <Link to="/friends?tab=suggestions" className="btn btn-primary">
                    Find friends
                  </Link>
                }
              >
                Add people you know to see their posts and chat with them.
              </EmptyState>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

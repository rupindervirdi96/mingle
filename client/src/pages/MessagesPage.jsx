import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, MessageCircle, MessageCirclePlus, Search, SendHorizontal, Smile, UserRoundX } from "lucide-react";
import { useAppDispatch, useAppSelector, useMe } from "../store";
import {
  fetchConversations,
  fetchMessages,
  markRead,
  openConversation,
  retry,
  send,
  setActive,
} from "../store/chatSlice";
import { emitTyping } from "../socket";
import { clock, dayLabel, sameDay, shortAgo } from "../lib/time";
import { Avatar, EmptyState, Modal, PageSpinner, Spinner, usePopover } from "../components/ui";

const EMOJIS = ["😀", "😂", "🥰", "😍", "😎", "🤔", "😅", "😭", "😮", "😡", "👍", "👎", "👏", "🙏", "🙌", "💪", "🔥", "✨", "🎉", "❤️", "💜", "💯", "👋", "🍕"];

function ConversationItem({ conversation, active, meId }) {
  const online = useAppSelector((s) => Boolean(s.friends.online[conversation.friend._id]));
  const typing = useAppSelector((s) => s.chat.typing[conversation._id]);
  const last = conversation.lastMessage;
  const preview = typing ? "typing…" : last ? `${last.sender === meId ? "You: " : ""}${last.text}` : "Say hello 👋";

  return (
    <Link
      to={`/messages/${conversation.friend._id}`}
      className={`convo ${active ? "active" : ""} ${conversation.unread ? "unread" : ""}`}
    >
      <Avatar src={conversation.friend.profilePic} name={conversation.friend.name} size={52} online={online} />
      <span className="grow">
        <span className="convo-top">
          <span className="convo-name truncate">{conversation.friend.name}</span>
          {last && <span className="convo-time">{shortAgo(last.createdAt)}</span>}
        </span>
        <span className="convo-bottom">
          <span className={`convo-preview truncate ${typing ? "typing-text" : ""}`}>{preview}</span>
          {conversation.unread > 0 && <span className="convo-badge">{conversation.unread}</span>}
        </span>
      </span>
    </Link>
  );
}

function NewChatModal({ onClose }) {
  const friends = useAppSelector((s) => s.friends.friends);
  const online = useAppSelector((s) => s.friends.online);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const shown = friends.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Modal title="New message" onClose={onClose}>
      <div className="stack" style={{ gap: 12 }}>
        <div className="input-icon">
          <Search />
          <input className="input" placeholder="Search friends" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
        </div>
        {friends.length ? (
          <div className="picker-list">
            {shown.map((f) => (
              <button
                key={f._id}
                className="menu-item"
                onClick={() => {
                  onClose();
                  navigate(`/messages/${f._id}`);
                }}
              >
                <Avatar src={f.profilePic} name={f.name} size={40} online={Boolean(online[f._id])} />
                <span className="grow truncate" style={{ fontWeight: 600 }}>
                  {f.name}
                </span>
              </button>
            ))}
            {!shown.length && <p className="muted center-pad">No friends match “{q}”.</p>}
          </div>
        ) : (
          <EmptyState icon={UserRoundX} title="No friends yet" action={<Link to="/friends?tab=suggestions" className="btn btn-primary" onClick={onClose}>Find friends</Link>}>
            You can message people once you're friends.
          </EmptyState>
        )}
      </div>
    </Modal>
  );
}

function Composer({ conversationId, friendName }) {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const input = useRef();
  const typingRef = useRef({ sent: 0, timer: null });
  const emoji = usePopover();

  useEffect(() => {
    setText("");
    input.current?.focus();
    const state = typingRef.current;
    return () => {
      clearTimeout(state.timer);
      if (state.sent) emitTyping(conversationId, false);
      state.sent = 0;
    };
  }, [conversationId]);

  const stopTyping = () => {
    const state = typingRef.current;
    clearTimeout(state.timer);
    if (state.sent) emitTyping(conversationId, false);
    state.sent = 0;
  };

  // Tell the other person we're typing at most every 2s, and stop after 3s of quiet.
  const typing = () => {
    const state = typingRef.current;
    if (Date.now() - state.sent > 2000) {
      emitTyping(conversationId, true);
      state.sent = Date.now();
    }
    clearTimeout(state.timer);
    state.timer = setTimeout(stopTyping, 3000);
  };

  const grow = () => {
    const el = input.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const submit = (e) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value) return;
    dispatch(send({ conversationId, text: value }));
    setText("");
    stopTyping();
    requestAnimationFrame(grow);
    input.current?.focus();
  };

  const addEmoji = (char) => {
    setText((t) => t + char);
    emoji.close();
    input.current?.focus();
  };

  return (
    <form className="chat-composer" onSubmit={submit}>
      <div className="nav-pop" ref={emoji.ref}>
        <button type="button" className={`icon-btn ${emoji.open ? "active" : ""}`} onClick={emoji.toggle} aria-label="Insert emoji">
          <Smile />
        </button>
        {emoji.open && (
          <div className="popover emoji-picker">
            {EMOJIS.map((e) => (
              <button type="button" key={e} onClick={() => addEmoji(e)} aria-label={`Insert ${e}`}>
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
      <textarea
        ref={input}
        rows={1}
        className="chat-input"
        placeholder={`Message ${friendName.split(" ")[0]}…`}
        value={text}
        maxLength={4000}
        onChange={(e) => {
          setText(e.target.value);
          grow();
          if (e.target.value) typing();
          else stopTyping();
        }}
        onBlur={stopTyping}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        aria-label="Message"
      />
      <button className="send-btn" disabled={!text.trim()} aria-label="Send">
        <SendHorizontal />
      </button>
    </form>
  );
}

function Thread({ friendId }) {
  const dispatch = useAppDispatch();
  const me = useMe();
  const navigate = useNavigate();
  const conversation = useAppSelector((s) => s.chat.conversations.find((c) => c.friend._id === friendId));
  const thread = useAppSelector((s) => (conversation ? s.chat.threads[conversation._id] : null));
  const typing = useAppSelector((s) => conversation && s.chat.typing[conversation._id] === friendId);
  const online = useAppSelector((s) => Boolean(s.friends.online[friendId]));
  const [error, setError] = useState(null);
  const scroller = useRef();
  const stickToBottom = useRef(true);
  const restore = useRef(null);
  const conversationId = conversation?._id;

  useEffect(() => {
    setError(null);
    dispatch(openConversation(friendId))
      .unwrap()
      .catch((message) => setError(message));
  }, [friendId, dispatch]);

  useEffect(() => {
    if (!conversationId) return;
    dispatch(setActive(conversationId));
    stickToBottom.current = true;
    dispatch(fetchMessages({ conversationId }));
    dispatch(markRead(conversationId));
    const onVisible = () => {
      if (!document.hidden) dispatch(markRead(conversationId));
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      dispatch(setActive(null));
    };
  }, [conversationId, dispatch]);

  const messages = thread?.messages || [];

  // Keep the view pinned to the newest message, or hold position after loading older ones.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (restore.current !== null) {
      el.scrollTop = el.scrollHeight - restore.current;
      restore.current = null;
    } else if (stickToBottom.current || messages[messages.length - 1]?.sender === me._id) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, typing, me._id]);

  const onScroll = () => {
    const el = scroller.current;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (el.scrollTop < 60 && thread?.hasMore && !thread.loading) {
      restore.current = el.scrollHeight - el.scrollTop;
      dispatch(fetchMessages({ conversationId, more: true }));
    }
  };

  if (error) {
    return (
      <div className="thread-empty">
        <EmptyState
          icon={AlertCircle}
          title="Can't open this chat"
          action={
            <Link to={`/profile/${friendId}`} className="btn btn-primary">
              View profile
            </Link>
          }
        >
          {error}
        </EmptyState>
      </div>
    );
  }
  if (!conversation) return <PageSpinner />;

  const { friend } = conversation;
  const friendRead = conversation.friendLastRead ? new Date(conversation.friendLastRead) : null;
  const lastMine = [...messages].reverse().find((m) => m.sender === me._id && !m.pending && !m.failed);

  return (
    <>
      <header className="thread-head">
        <button className="icon-btn mobile-only" onClick={() => navigate("/messages")} aria-label="Back to chats">
          <ArrowLeft />
        </button>
        <Link to={`/profile/${friend._id}`} className="row grow" style={{ minWidth: 0 }}>
          <Avatar src={friend.profilePic} name={friend.name} size={42} online={online} />
          <span className="grow">
            <strong className="truncate" style={{ display: "block" }}>
              {friend.name}
            </strong>
            <span className={`thread-status ${typing ? "typing-text" : online ? "online-text" : ""}`}>
              {typing ? "typing…" : online ? "Active now" : "Offline"}
            </span>
          </span>
        </Link>
      </header>

      <div className="thread-body" ref={scroller} onScroll={onScroll}>
        {!thread?.loaded ? (
          <PageSpinner />
        ) : (
          <>
            {thread.hasMore ? (
              <div className="center-pad" style={{ padding: 12 }}>
                {thread.loading && <Spinner size="sm" />}
              </div>
            ) : (
              <div className="thread-intro">
                <Avatar src={friend.profilePic} name={friend.name} size={84} />
                <strong>{friend.name}</strong>
                <span className="muted">You're friends on Mingle. Say hi! 👋</span>
              </div>
            )}
            {messages.map((m, i) => {
              const prev = messages[i - 1];
              const next = messages[i + 1];
              const mine = m.sender === me._id;
              const newDay = !prev || !sameDay(prev.createdAt, m.createdAt);
              const gap = (a, b) => Math.abs(new Date(a.createdAt) - new Date(b.createdAt)) > 5 * 60 * 1000;
              const first = newDay || !prev || prev.sender !== m.sender || gap(prev, m);
              const last = !next || next.sender !== m.sender || gap(m, next) || !sameDay(m.createdAt, next.createdAt);
              const seen = lastMine?._id === m._id && friendRead && friendRead >= new Date(m.createdAt);

              return (
                <Fragment key={m.clientId || m._id}>
                  {newDay && <div className="day-sep">{dayLabel(m.createdAt)}</div>}
                  {first && !newDay && prev && gap(prev, m) && <div className="time-sep">{clock(m.createdAt)}</div>}
                  <div className={`msg-row ${mine ? "mine" : "theirs"} ${first ? "first" : ""} ${last ? "last" : ""}`}>
                    {!mine && <span className="msg-avatar">{last && <Avatar src={friend.profilePic} name={friend.name} size={28} />}</span>}
                    <div className={`bubble ${m.pending ? "pending" : ""} ${m.failed ? "failed" : ""}`} title={clock(m.createdAt)}>
                      {m.text}
                    </div>
                  </div>
                  {m.failed && (
                    <button className="msg-status failed" onClick={() => dispatch(retry(m))}>
                      <AlertCircle size={13} /> Not sent · Tap to retry
                    </button>
                  )}
                  {mine && last && !m.failed && (m.pending || lastMine?._id === m._id) && (
                    <div className="msg-status">{m.pending ? "Sending…" : seen ? "Seen" : `Sent ${clock(m.createdAt)}`}</div>
                  )}
                </Fragment>
              );
            })}
            {typing && (
              <div className="msg-row theirs first last">
                <span className="msg-avatar">
                  <Avatar src={friend.profilePic} name={friend.name} size={28} />
                </span>
                <div className="bubble typing-bubble" aria-label={`${friend.name} is typing`}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Composer conversationId={conversation._id} friendName={friend.name} />
    </>
  );
}

export default function MessagesPage() {
  const { friendId } = useParams();
  const dispatch = useAppDispatch();
  const me = useMe();
  const { conversations, loaded } = useAppSelector((s) => s.chat);
  const friends = useAppSelector((s) => s.friends.friends);
  const online = useAppSelector((s) => s.friends.online);
  const [q, setQ] = useState("");
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const shown = useMemo(
    () =>
      conversations.filter(
        (c) =>
          (c.lastMessage || c.friend._id === friendId) &&
          c.friend.name.toLowerCase().includes(q.trim().toLowerCase())
      ),
    [conversations, friendId, q]
  );
  const onlineFriends = friends.filter((f) => online[f._id]);

  return (
    <div className={`messenger ${friendId ? "has-thread" : ""}`}>
      <aside className="chat-list">
        <div className="chat-list-head">
          <h1>Chats</h1>
          <button className="icon-btn filled" onClick={() => setPicking(true)} aria-label="New message">
            <MessageCirclePlus />
          </button>
        </div>
        <div className="input-icon chat-search">
          <Search />
          <input className="input" placeholder="Search chats" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {onlineFriends.length > 0 && (
          <div className="online-strip" aria-label="Online friends">
            {onlineFriends.map((f) => (
              <Link key={f._id} to={`/messages/${f._id}`} className="online-friend" title={f.name}>
                <Avatar src={f.profilePic} name={f.name} size={52} online />
                <span className="truncate">{f.name.split(" ")[0]}</span>
              </Link>
            ))}
          </div>
        )}
        <div className="convo-list">
          {!loaded ? (
            <PageSpinner />
          ) : shown.length ? (
            shown.map((c) => <ConversationItem key={c._id} conversation={c} active={c.friend._id === friendId} meId={me._id} />)
          ) : (
            <EmptyState
              icon={MessageCircle}
              title={q ? "No chats found" : "No conversations yet"}
              action={
                !q && (
                  <button className="btn btn-primary sm" onClick={() => setPicking(true)}>
                    <MessageCirclePlus /> Start a chat
                  </button>
                )
              }
            >
              {q ? "Try another name." : "Messages you send and receive will show up here."}
            </EmptyState>
          )}
        </div>
      </aside>
      <section className="chat-thread">
        {friendId ? (
          <Thread key={friendId} friendId={friendId} />
        ) : (
          <div className="thread-empty">
            <EmptyState
              icon={MessageCircle}
              title="Your messages"
              action={
                <button className="btn btn-brand" onClick={() => setPicking(true)}>
                  <MessageCirclePlus /> New message
                </button>
              }
            >
              Pick a conversation or start a new one. Messages arrive instantly.
            </EmptyState>
          </div>
        )}
      </section>
      {picking && <NewChatModal onClose={() => setPicking(false)} />}
    </div>
  );
}

import { useRef, useState } from "react";
import { Link } from "react-router";
import { Heart, Link2, MessageCircle, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useAppDispatch, useMe } from "../store";
import { addComment, deleteComment, deletePost, toggleLike } from "../store/postsSlice";
import { toast, toastError } from "../store/uiSlice";
import { longAgo, shortAgo } from "../lib/time";
import { Avatar, ConfirmModal, Modal, Spinner, usePopover } from "./ui";

function Comments({ post, autoFocus }) {
  const me = useMe();
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const comments = showAll ? post.comments : post.comments.slice(-3);
  const hidden = post.comments.length - comments.length;

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await dispatch(addComment({ postId: post._id, text: text.trim() })).unwrap();
      setText("");
    } catch (message) {
      dispatch(toastError(message));
    }
    setBusy(false);
  };

  return (
    <div className="comments">
      {hidden > 0 && (
        <button className="link comments-more" onClick={() => setShowAll(true)}>
          View {hidden} earlier {hidden === 1 ? "comment" : "comments"}
        </button>
      )}
      {comments.map((c) => {
        const canDelete = c.author._id === me._id || post.author._id === me._id;
        return (
          <div className="comment" key={c._id}>
            <Link to={`/profile/${c.author._id}`}>
              <Avatar src={c.author.profilePic} name={c.author.name} size={32} />
            </Link>
            <div className="comment-main">
              <div className="comment-bubble">
                <Link to={`/profile/${c.author._id}`} className="comment-author">
                  {c.author.name}
                </Link>
                <p className="prewrap">{c.text}</p>
              </div>
              <div className="comment-meta">
                <span title={longAgo(c.time)}>{shortAgo(c.time)}</span>
                {canDelete && (
                  <button onClick={() => dispatch(deleteComment({ postId: post._id, commentId: c._id }))}>Delete</button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <form className="comment-form" onSubmit={submit}>
        <Avatar src={me.profilePic} name={me.name} size={32} />
        <div className="comment-input">
          <input
            className="input"
            placeholder="Write a comment…"
            value={text}
            maxLength={1000}
            autoFocus={autoFocus}
            onChange={(e) => setText(e.target.value)}
            aria-label="Write a comment"
          />
          <button className="icon-btn sm" disabled={!text.trim() || busy} aria-label="Send comment">
            {busy ? <Spinner size="sm" /> : <Send />}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PostCard({ post, expanded = false }) {
  const me = useMe();
  const dispatch = useAppDispatch();
  const [showComments, setShowComments] = useState(expanded || post.comments.length > 0);
  const [focusComment, setFocusComment] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [burst, setBurst] = useState(false);
  const menu = usePopover();
  const mine = post.author._id === me._id;
  const lastTap = useRef(0);

  const like = () => {
    if (!post.liked) {
      setBurst(true);
      setTimeout(() => setBurst(false), 450);
    }
    dispatch(toggleLike(post._id));
  };

  const copyLink = async () => {
    menu.close();
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`);
      dispatch(toast({ title: "Link copied", tone: "success", duration: 2000 }));
    } catch {
      dispatch(toastError("Couldn't copy the link."));
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await dispatch(deletePost(post._id)).unwrap();
      dispatch(toast({ title: "Post deleted", tone: "success", duration: 2000 }));
    } catch (message) {
      dispatch(toastError(message));
      setDeleting(false);
      setConfirming(false);
    }
  };

  // Double-tap the photo to like, like other social apps.
  const onImageTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!post.liked) like();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current === now) setLightbox(true);
      }, 300);
    }
  };

  return (
    <article className="card post">
      <header className="post-head">
        <Link to={`/profile/${post.author._id}`}>
          <Avatar src={post.author.profilePic} name={post.author.name} size={44} />
        </Link>
        <div className="grow">
          <Link to={`/profile/${post.author._id}`} className="post-author">
            {post.author.name}
          </Link>
          <Link to={`/posts/${post._id}`} className="post-time" title={longAgo(post.date)}>
            {longAgo(post.date)}
          </Link>
        </div>
        <div className="nav-pop" ref={menu.ref}>
          <button className="icon-btn sm" onClick={menu.toggle} aria-label="Post options">
            <MoreHorizontal />
          </button>
          {menu.open && (
            <div className="popover post-menu">
              <button className="menu-item" onClick={copyLink}>
                <Link2 /> Copy link
              </button>
              {mine && (
                <button
                  className="menu-item danger"
                  onClick={() => {
                    menu.close();
                    setConfirming(true);
                  }}
                >
                  <Trash2 /> Delete post
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {post.text && <p className={`post-text prewrap ${!post.image && post.text.length < 90 ? "big" : ""}`}>{post.text}</p>}

      {post.image && (
        <button className="post-image" onClick={onImageTap} aria-label="Open photo">
          <img src={post.image} alt="" loading="lazy" />
          {burst && (
            <span className="like-burst">
              <Heart />
            </span>
          )}
        </button>
      )}

      {(post.likeCount > 0 || post.comments.length > 0) && (
        <div className="post-stats">
          {post.likeCount > 0 && (
            <span className="row" style={{ gap: 6 }}>
              <span className="like-dot">
                <Heart />
              </span>
              {post.likeCount}
            </span>
          )}
          <span className="grow" />
          {post.comments.length > 0 && (
            <button onClick={() => setShowComments((s) => !s)}>
              {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
            </button>
          )}
        </div>
      )}

      <div className="post-actions">
        <button className={`post-action ${post.liked ? "liked" : ""}`} onClick={like} aria-pressed={post.liked}>
          <Heart className={burst ? "beat" : ""} /> {post.liked ? "Liked" : "Like"}
        </button>
        <button
          className="post-action"
          onClick={() => {
            setShowComments(true);
            setFocusComment(true);
          }}
        >
          <MessageCircle /> Comment
        </button>
        <button className="post-action" onClick={copyLink}>
          <Link2 /> Share
        </button>
      </div>

      {showComments && <Comments post={post} autoFocus={focusComment} />}

      {confirming && (
        <ConfirmModal title="Delete post?" onConfirm={remove} onClose={() => setConfirming(false)} busy={deleting}>
          This post and its likes and comments will be removed for everyone. This can't be undone.
        </ConfirmModal>
      )}
      {lightbox && (
        <Modal title="Photo" onClose={() => setLightbox(false)} className="lightbox" bare>
          <img src={post.image} alt="" onClick={() => setLightbox(false)} />
        </Modal>
      )}
    </article>
  );
}

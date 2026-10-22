import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, MessageSquare, Trash2, UserCheck, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { acceptRequest, removeRequest } from "../store/friendsSlice";
import { deleteNotification, markNotificationRead } from "../store/notificationsSlice";
import { toastError } from "../store/uiSlice";
import { describe } from "../lib/notificationText";
import { shortAgo } from "../lib/time";
import { Avatar, Spinner } from "./ui";

const TYPE_ICON = {
  friend_request: { Icon: UserPlus, tone: "primary" },
  friend_accept: { Icon: UserCheck, tone: "success" },
  post_like: { Icon: Heart, tone: "like" },
  post_comment: { Icon: MessageSquare, tone: "primary" },
};

export default function NotificationItem({ notification, onNavigate, showDelete = false }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pendingRequest = useAppSelector((s) =>
    notification.type === "friend_request" && s.friends.received.some((r) => r._id === notification.actor._id)
  );
  const [busy, setBusy] = useState(null);
  const { verb, quote, link } = describe(notification);
  const { Icon, tone } = TYPE_ICON[notification.type] || TYPE_ICON.post_comment;

  const open = () => {
    if (!notification.read) dispatch(markNotificationRead(notification._id));
    onNavigate?.();
    navigate(link);
  };

  const respond = async (action, e) => {
    e.stopPropagation();
    setBusy(action);
    try {
      const thunk = action === "accept" ? acceptRequest : removeRequest;
      // The server removes the request notification itself once it's answered.
      await dispatch(thunk(notification.actor._id)).unwrap();
    } catch (message) {
      dispatch(toastError(message));
    }
    setBusy(null);
  };

  return (
    <div
      className={`notif ${notification.read ? "" : "unread"}`}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
    >
      <span className="notif-avatar">
        <Avatar src={notification.actor.profilePic} name={notification.actor.name} size={48} />
        <span className={`notif-type ${tone}`}>
          <Icon />
        </span>
      </span>
      <span className="notif-body">
        <span className="notif-text">
          <strong>{notification.actor.name}</strong> {verb}
          {quote && <span className="notif-quote"> “{quote}”</span>}
        </span>
        <span className={`notif-time ${notification.read ? "" : "fresh"}`}>{shortAgo(notification.createdAt)}</span>
        {pendingRequest && (
          <span className="row notif-actions">
            <button className="btn btn-primary sm" onClick={(e) => respond("accept", e)} disabled={!!busy}>
              {busy === "accept" ? <Spinner size="sm" light /> : "Confirm"}
            </button>
            <button className="btn btn-secondary sm" onClick={(e) => respond("decline", e)} disabled={!!busy}>
              {busy === "decline" ? <Spinner size="sm" /> : "Delete"}
            </button>
          </span>
        )}
      </span>
      {showDelete ? (
        <button
          className="icon-btn sm notif-delete"
          aria-label="Remove notification"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteNotification(notification._id));
          }}
        >
          <Trash2 />
        </button>
      ) : (
        !notification.read && <span className="unread-dot" aria-label="Unread" />
      )}
    </div>
  );
}

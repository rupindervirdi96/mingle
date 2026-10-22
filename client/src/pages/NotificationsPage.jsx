import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchNotifications, markAllRead } from "../store/notificationsSlice";
import { EmptyState, PageSpinner, Spinner } from "../components/ui";
import NotificationItem from "../components/NotificationItem";
import { DesktopPrompt } from "../components/NotificationBell";

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { items, unread, hasMore, loaded, loading } = useAppSelector((s) => s.notifications);
  const [filter, setFilter] = useState("all");
  const shown = filter === "unread" ? items.filter((n) => !n.read) : items;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="narrow">
      <header className="page-head">
        <div>
          <h1>Notifications</h1>
          <p className="muted">{unread ? `You have ${unread} unread` : "You're all caught up"}</p>
        </div>
        {unread > 0 && (
          <button className="btn btn-soft sm" onClick={() => dispatch(markAllRead())}>
            <CheckCheck /> Mark all read
          </button>
        )}
      </header>
      <div className="card notif-page">
        <div className="segmented notif-filter">
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
            All
          </button>
          <button className={filter === "unread" ? "on" : ""} onClick={() => setFilter("unread")}>
            Unread {unread > 0 && `(${unread})`}
          </button>
        </div>
        <DesktopPrompt />
        {!loaded ? (
          <PageSpinner />
        ) : shown.length ? (
          <div className="notif-list">
            {shown.map((n) => (
              <NotificationItem key={n._id} notification={n} showDelete />
            ))}
            {hasMore && filter === "all" && (
              <button className="btn btn-ghost block" onClick={() => dispatch(fetchNotifications({ more: true }))} disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Show older notifications"}
              </button>
            )}
          </div>
        ) : (
          <EmptyState icon={Bell} title={filter === "unread" ? "No unread notifications" : "No notifications yet"}>
            When friends like or comment on your posts, or send you requests, you'll see it here.
          </EmptyState>
        )}
      </div>
    </div>
  );
}

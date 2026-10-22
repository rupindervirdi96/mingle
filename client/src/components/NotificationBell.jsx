import { useState } from "react";
import { Link } from "react-router";
import { Bell, BellRing, CheckCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { markAllRead } from "../store/notificationsSlice";
import { desktopPermission, requestDesktopPermission } from "../lib/desktop";
import { EmptyState, PageSpinner, usePopover } from "./ui";
import NotificationItem from "./NotificationItem";

export function DesktopPrompt() {
  const [permission, setPermission] = useState(desktopPermission());
  if (permission !== "default") return null;
  return (
    <div className="desktop-prompt">
      <BellRing />
      <span className="grow">Get notified about messages and activity even when Mingle is in the background.</span>
      <button className="btn btn-soft sm" onClick={async () => setPermission(await requestDesktopPermission())}>
        Turn on
      </button>
    </div>
  );
}

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const { items, unread, loaded } = useAppSelector((s) => s.notifications);
  const pop = usePopover();
  const [filter, setFilter] = useState("all");
  const shown = (filter === "unread" ? items.filter((n) => !n.read) : items).slice(0, 8);

  return (
    <div className="nav-pop desktop-only" ref={pop.ref}>
      <button
        className={`icon-btn filled ${pop.open ? "active" : ""}`}
        onClick={pop.toggle}
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={pop.open}
      >
        <Bell />
        {unread > 0 && <span className="badge">{unread > 99 ? "99+" : unread}</span>}
      </button>
      {pop.open && (
        <div className="popover notif-panel">
          <div className="notif-panel-head">
            <h2>Notifications</h2>
            {unread > 0 && (
              <button className="btn btn-ghost sm" onClick={() => dispatch(markAllRead())}>
                <CheckCheck /> Mark all read
              </button>
            )}
          </div>
          <div className="segmented notif-filter">
            <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
              All
            </button>
            <button className={filter === "unread" ? "on" : ""} onClick={() => setFilter("unread")}>
              Unread {unread > 0 && `(${unread})`}
            </button>
          </div>
          <DesktopPrompt />
          <div className="notif-list">
            {!loaded ? (
              <PageSpinner />
            ) : shown.length ? (
              shown.map((n) => <NotificationItem key={n._id} notification={n} onNavigate={pop.close} />)
            ) : (
              <EmptyState icon={Bell} title={filter === "unread" ? "You're all caught up" : "No notifications yet"}>
                Likes, comments and friend requests will show up here.
              </EmptyState>
            )}
          </div>
          <Link to="/notifications" className="notif-panel-foot" onClick={pop.close}>
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

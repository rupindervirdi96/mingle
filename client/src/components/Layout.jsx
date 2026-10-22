import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  Monitor,
  Moon,
  Search,
  Sun,
  User,
  Users,
} from "lucide-react";
import api from "../api/client";
import { useAppDispatch, useAppSelector, useMe } from "../store";
import { selectUnreadChats } from "../store/chatSlice";
import { logout } from "../store/session";
import { setTheme } from "../store/uiSlice";
import { Avatar, Logo, usePopover } from "./ui";
import NotificationBell from "./NotificationBell";
import Toasts from "./Toasts";

const Badge = ({ count }) => (count > 0 ? <span className="badge">{count > 99 ? "99+" : count}</span> : null);

function SearchBox() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const pop = usePopover();
  const navigate = useNavigate();
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    const query = q.trim();
    if (!query) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const { data } = await api.get("/profiles/search", { params: { q: query } });
        setResults(data.slice(0, 6));
      } catch {
        setResults([]);
      }
    }, 220);
    return () => clearTimeout(timer.current);
  }, [q]);

  const go = (path) => {
    pop.close();
    setQ("");
    navigate(path);
  };

  return (
    <div className="search-box" ref={pop.ref}>
      <form
        className="input-icon"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
      >
        <Search />
        <input
          className="input"
          placeholder="Search Mingle"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            pop.setOpen(true);
          }}
          onFocus={() => pop.setOpen(true)}
          aria-label="Search people"
        />
      </form>
      {pop.open && q.trim() && (
        <div className="popover search-results">
          {results.map((p) => (
            <button key={p._id} className="menu-item" onClick={() => go(`/profile/${p._id}`)}>
              <Avatar src={p.profilePic} name={p.name} size={36} />
              <span className="grow">
                <span className="truncate" style={{ display: "block", fontWeight: 600 }}>
                  {p.name}
                </span>
                <span className="faint" style={{ fontSize: 12 }}>
                  {p.relationship === "friends" ? "Friend" : p.relationship === "received" ? "Sent you a request" : "Person"}
                </span>
              </span>
            </button>
          ))}
          <button className="menu-item" onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}>
            <span className="icon-btn filled sm" aria-hidden="true">
              <Search />
            </span>
            <span>
              See all results for <strong>{q.trim()}</strong>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const me = useMe();
  const theme = useAppSelector((s) => s.ui.theme);
  const dispatch = useAppDispatch();
  const pop = usePopover();
  const themes = [
    { id: "system", label: "Auto", Icon: Monitor },
    { id: "light", label: "Light", Icon: Sun },
    { id: "dark", label: "Dark", Icon: Moon },
  ];

  return (
    <div className="nav-pop" ref={pop.ref}>
      <button className="account-btn" onClick={pop.toggle} aria-label="Account menu" aria-expanded={pop.open}>
        <Avatar src={me.profilePic} name={me.name} size={38} />
      </button>
      {pop.open && (
        <div className="popover account-menu">
          <Link to={`/profile/${me._id}`} className="menu-item account-head" onClick={pop.close}>
            <Avatar src={me.profilePic} name={me.name} size={44} />
            <span className="grow">
              <strong className="truncate" style={{ display: "block" }}>
                {me.name}
              </strong>
              <span className="faint" style={{ fontSize: 13 }}>
                View your profile
              </span>
            </span>
          </Link>
          <div className="menu-sep" />
          <div className="theme-picker">
            <span className="faint">Appearance</span>
            <div className="segmented">
              {themes.map(({ id, label, Icon }) => (
                <button key={id} className={theme === id ? "on" : ""} onClick={() => dispatch(setTheme(id))}>
                  <span className="row" style={{ gap: 6 }}>
                    <Icon size={15} /> {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="menu-sep" />
          <button className="menu-item" onClick={() => dispatch(logout())}>
            <LogOut /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const requests = useAppSelector((s) => s.friends.received.length);
  const unreadChats = useAppSelector(selectUnreadChats);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" aria-label="Mingle home">
          <Logo />
        </Link>
        <SearchBox />
      </div>
      <nav className="navbar-center" aria-label="Main">
        <NavLink to="/" end className="nav-tab" title="Home">
          <Home />
        </NavLink>
        <NavLink to="/friends" className="nav-tab" title="Friends">
          <Users />
          <Badge count={requests} />
        </NavLink>
        <NavLink to="/messages" className="nav-tab" title="Messages">
          <MessageCircle />
          <Badge count={unreadChats} />
        </NavLink>
      </nav>
      <div className="navbar-right">
        <Link to="/search" className="icon-btn filled mobile-only" aria-label="Search">
          <Search />
        </Link>
        <Link to="/messages" className="icon-btn filled mobile-only" aria-label="Messages">
          <MessageCircle />
          <Badge count={unreadChats} />
        </Link>
        <NotificationBell />
        <AccountMenu />
      </div>
    </header>
  );
}

function MobileTabs() {
  const me = useMe();
  const requests = useAppSelector((s) => s.friends.received.length);
  const unread = useAppSelector((s) => s.notifications.unread);

  return (
    <nav className="mobile-tabs" aria-label="Main">
      <NavLink to="/" end>
        <Home />
        <span>Home</span>
      </NavLink>
      <NavLink to="/friends">
        <Users />
        <Badge count={requests} />
        <span>Friends</span>
      </NavLink>
      <NavLink to="/notifications">
        <Bell />
        <Badge count={unread} />
        <span>Alerts</span>
      </NavLink>
      <NavLink to={`/profile/${me._id}`}>
        <User />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const fullHeight = pathname.startsWith("/messages");

  useEffect(() => {
    if (!fullHeight) window.scrollTo(0, 0);
  }, [pathname, fullHeight]);

  return (
    <div className={`app ${fullHeight ? "app-full" : ""}`}>
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <MobileTabs />
      <Toasts />
    </div>
  );
}

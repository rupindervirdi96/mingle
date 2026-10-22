import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { WifiOff } from "lucide-react";
import { setUnauthorizedHandler } from "./api/client";
import { useAppDispatch, useAppSelector } from "./store";
import { bootstrap, loadConfig } from "./store/authSlice";
import { selectUnreadChats } from "./store/chatSlice";
import { logout, startSession } from "./store/session";
import { applyTheme } from "./store/uiSlice";
import { setNavigate } from "./lib/navigation";
import { Logo, Spinner } from "./components/ui";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import PostPage from "./pages/PostPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";

function Splash({ offline, onRetry }) {
  return (
    <div className="splash">
      <Logo size={56} withText={false} />
      {offline ? (
        <>
          <p className="muted row">
            <WifiOff size={18} /> Can't reach Mingle right now.
          </p>
          <button className="btn btn-primary" onClick={onRetry}>
            Try again
          </button>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

// Keeps the tab title showing how many things are waiting for you.
function useTitleBadge() {
  const notifications = useAppSelector((s) => s.notifications.unread);
  const chats = useAppSelector(selectUnreadChats);
  useEffect(() => {
    const total = notifications + chats;
    document.title = total ? `(${total}) Mingle` : "Mingle";
  }, [notifications, chats]);
}

export default function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const theme = useAppSelector((s) => s.ui.theme);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setNavigate(navigate), [navigate]);
  useEffect(() => applyTheme(theme), [theme]);

  useEffect(() => {
    setUnauthorizedHandler(() => dispatch(logout()));
    dispatch(loadConfig());
    dispatch(bootstrap());
  }, [dispatch]);

  useEffect(() => {
    if (status === "authed") dispatch(startSession());
  }, [status, dispatch]);

  useTitleBadge();

  if (status === "checking" || status === "offline") {
    return <Splash offline={status === "offline"} onRetry={() => dispatch(bootstrap())} />;
  }

  if (status === "guest") {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="*"
          element={<Navigate to="/login" replace state={{ from: location.pathname + location.search }} />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="friends" element={<FriendsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="messages/:friendId" element={<MessagesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="posts/:id" element={<PostPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<Navigate to={location.state?.from || "/"} replace />} />
        <Route path="signup" element={<Navigate to="/" replace />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

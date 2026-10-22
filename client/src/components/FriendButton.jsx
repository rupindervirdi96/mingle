import { useState } from "react";
import { Link } from "react-router";
import { Check, MessageCircle, UserCheck, UserMinus, UserPlus, UserX } from "lucide-react";
import { useAppDispatch, useAppSelector, useMe } from "../store";
import { acceptRequest, removeRequest, sendRequest, unfriend } from "../store/friendsSlice";
import { toastError } from "../store/uiSlice";
import { Avatar, ConfirmModal, Spinner, usePopover } from "./ui";

// The friends slice is the source of truth once loaded; `fallback` covers the moment before.
export function useRelationship(profileId, fallback = "none") {
  const me = useMe();
  return useAppSelector((s) => {
    if (profileId === me._id) return "self";
    const f = s.friends;
    if (!f.loaded) return fallback;
    if (f.friends.some((p) => p._id === profileId)) return "friends";
    if (f.received.some((p) => p._id === profileId)) return "received";
    if (f.sent.some((p) => p._id === profileId)) return "requested";
    return "none";
  });
}

function useFriendAction() {
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(null);
  const run = async (name, thunk, id) => {
    setBusy(name);
    try {
      await dispatch(thunk(id)).unwrap();
    } catch (message) {
      dispatch(toastError(message));
    }
    setBusy(null);
  };
  return { busy, run };
}

export default function FriendButton({ profileId, name, fallback, size = "", showMessage = false }) {
  const relationship = useRelationship(profileId, fallback);
  const { busy, run } = useFriendAction();
  const [confirm, setConfirm] = useState(false);
  const menu = usePopover();
  const sm = size === "sm" ? "sm" : "";
  const icon = (name, Icon) => (busy === name ? <Spinner size="sm" /> : <Icon />);

  if (relationship === "self") return null;

  if (relationship === "received") {
    return (
      <div className="row btn-row">
        <button className={`btn btn-primary ${sm}`} onClick={() => run("accept", acceptRequest, profileId)} disabled={!!busy}>
          {icon("accept", Check)} Confirm
        </button>
        <button className={`btn btn-secondary ${sm}`} onClick={() => run("decline", removeRequest, profileId)} disabled={!!busy}>
          {icon("decline", UserX)} Delete
        </button>
      </div>
    );
  }

  if (relationship === "requested") {
    return (
      <button className={`btn btn-secondary ${sm}`} onClick={() => run("cancel", removeRequest, profileId)} disabled={!!busy}>
        {icon("cancel", UserX)} Cancel request
      </button>
    );
  }

  if (relationship === "friends") {
    return (
      <div className="row btn-row">
        <div className="nav-pop" ref={menu.ref}>
          <button className={`btn btn-secondary ${sm}`} onClick={menu.toggle} disabled={!!busy}>
            {icon("unfriend", UserCheck)} Friends
          </button>
          {menu.open && (
            <div className="popover" style={{ left: 0, top: "calc(100% + 6px)" }}>
              <button
                className="menu-item danger"
                onClick={() => {
                  menu.close();
                  setConfirm(true);
                }}
              >
                <UserMinus /> Unfriend
              </button>
            </div>
          )}
        </div>
        {showMessage && (
          <Link to={`/messages/${profileId}`} className={`btn btn-primary ${sm}`}>
            <MessageCircle /> Message
          </Link>
        )}
        {confirm && (
          <ConfirmModal
            title={`Unfriend ${name || "this person"}?`}
            confirmLabel="Unfriend"
            busy={busy === "unfriend"}
            onClose={() => setConfirm(false)}
            onConfirm={async () => {
              await run("unfriend", unfriend, profileId);
              setConfirm(false);
            }}
          >
            You'll no longer see each other's posts in your feeds or be able to message each other.
          </ConfirmModal>
        )}
      </div>
    );
  }

  return (
    <button className={`btn btn-primary ${sm}`} onClick={() => run("add", sendRequest, profileId)} disabled={!!busy}>
      {icon("add", UserPlus)} Add friend
    </button>
  );
}

// A person tile used on the Friends and Search pages.
export function PersonCard({ person, fallback, subtitle }) {
  const online = useAppSelector((s) => Boolean(s.friends.online[person._id]));
  return (
    <div className="card person-card">
      <Link to={`/profile/${person._id}`} className="person-photo">
        <Avatar src={person.profilePic} name={person.name} size={88} online={online} />
      </Link>
      <Link to={`/profile/${person._id}`} className="person-name truncate">
        {person.name}
      </Link>
      <span className="person-sub truncate">
        {subtitle ||
          (person.mutualCount
            ? `${person.mutualCount} mutual ${person.mutualCount === 1 ? "friend" : "friends"}`
            : person.status || " ")}
      </span>
      <FriendButton profileId={person._id} name={person.name} fallback={fallback} size="sm" showMessage />
    </div>
  );
}

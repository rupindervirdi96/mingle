import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function Avatar({ src, name = "", size = 40, online = false, ring = false, className = "" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <span className={`avatar ${ring ? "ring" : ""} ${className}`} style={{ width: size, height: size }}>
      {src && !failed ? (
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="avatar-fallback" style={{ fontSize: size * 0.38 }} aria-label={name}>
          {initials || "?"}
        </span>
      )}
      {online && <span className="presence" aria-label="Online" />}
    </span>
  );
}

export function Logo({ size = 34, withText = true }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="mingle-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5b3df5" />
            <stop offset=".6" stopColor="#b23dff" />
            <stop offset="1" stopColor="#ff5d8f" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill="url(#mingle-g)" />
        <circle cx="25" cy="28" r="12" fill="none" stroke="#fff" strokeWidth="5" />
        <circle cx="39" cy="36" r="12" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="5" />
      </svg>
      {withText && <span className="logo-text">mingle</span>}
    </span>
  );
}

export const Spinner = ({ size = "", light = false }) => (
  <span className={`spinner ${size} ${light ? "light" : ""}`} role="status" aria-label="Loading" />
);

export const PageSpinner = () => (
  <div className="center-pad">
    <Spinner />
  </div>
);

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="empty">
      {Icon && (
        <span className="empty-icon">
          <Icon />
        </span>
      )}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, className = "", bare = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        {!bare && (
          <div className="modal-head">
            <h2>{title}</h2>
            <button className="icon-btn filled sm" onClick={onClose} aria-label="Close">
              <X />
            </button>
          </div>
        )}
        {bare ? children : <div className="modal-body">{children}</div>}
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

// Open/close state for a popover that closes on outside click or Escape.
export function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return { open, setOpen, ref, toggle: () => setOpen((o) => !o), close: () => setOpen(false) };
}

export function ConfirmModal({ title, children, confirmLabel = "Delete", onConfirm, onClose, busy }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? <Spinner size="sm" /> : confirmLabel}
          </button>
        </>
      }
    >
      <p className="muted">{children}</p>
    </Modal>
  );
}

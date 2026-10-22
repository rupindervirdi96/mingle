import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { dismissToast } from "../store/uiSlice";
import { Avatar } from "./ui";

const ICONS = { error: AlertCircle, success: CheckCircle2, info: Info };

export default function Toasts() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.tone] || Info;
        const open = () => {
          if (t.link) navigate(t.link);
          dispatch(dismissToast(t.id));
        };
        return (
          <div
            key={t.id}
            className={`toast ${t.tone}`}
            role={t.link ? "button" : "status"}
            tabIndex={t.link ? 0 : undefined}
            onClick={t.link ? open : undefined}
            onKeyDown={(e) => t.link && e.key === "Enter" && open()}
            style={{ cursor: t.link ? "pointer" : "default" }}
          >
            {t.avatar || t.name ? (
              <Avatar src={t.avatar} name={t.name} size={36} />
            ) : (
              <span className="toast-icon">
                <Icon />
              </span>
            )}
            <div className="toast-body">
              <strong>{t.title}</strong>
              {t.body && <span>{t.body}</span>}
            </div>
            <button
              className="icon-btn sm"
              aria-label="Dismiss"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(dismissToast(t.id));
              }}
            >
              <X />
            </button>
          </div>
        );
      })}
    </div>
  );
}

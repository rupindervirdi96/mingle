import { useState } from "react";
import { Briefcase, CalendarDays, GraduationCap, Heart, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useAppDispatch } from "../store";
import { addInfo, removeInfo } from "../store/authSlice";
import { toastError } from "../store/uiSlice";
import { fullDate } from "../lib/time";
import { Modal, Spinner } from "./ui";

const RELATIONSHIPS = ["Single", "In a relationship", "Engaged", "Married", "It's complicated"];

const TYPES = {
  work: { label: "Work", Icon: Briefcase },
  education: { label: "Education", Icon: GraduationCap },
  location: { label: "Current city", Icon: MapPin },
  relation: { label: "Relationship", Icon: Heart },
};

const FIELDS = {
  work: [
    { key: "position", label: "Position", required: true },
    { key: "company", label: "Company", required: true },
    { key: "location", label: "City" },
  ],
  education: [
    { key: "course", label: "Course or degree", required: true },
    { key: "institute", label: "School", required: true },
    { key: "location", label: "City" },
  ],
  location: [
    { key: "city", label: "City", required: true },
    { key: "country", label: "Country", required: true },
  ],
};

export function infoText(info) {
  const at = (a, b) => [a, b].filter(Boolean).join(", ");
  switch (info.type) {
    case "work":
      return info.position ? (
        <>
          {info.position} at <strong>{info.company}</strong>
        </>
      ) : (
        <>
          Works at <strong>{at(info.company, info.location)}</strong>
        </>
      );
    case "education":
      return (
        <>
          {info.course ? `Studied ${info.course} at ` : "Studied at "}
          <strong>{info.institute}</strong>
        </>
      );
    case "location":
      return (
        <>
          Lives in <strong>{at(info.city, info.country)}</strong>
        </>
      );
    case "relation":
      return <strong>{info.rel}</strong>;
    default:
      return null;
  }
}

export function InfoLine({ info, onRemove, busy }) {
  const { Icon } = TYPES[info.type] || TYPES.location;
  return (
    <li className="info-line">
      <Icon />
      <span className="grow">{infoText(info)}</span>
      {onRemove && (
        <button className="icon-btn sm" onClick={onRemove} disabled={busy} aria-label="Remove">
          {busy ? <Spinner size="sm" /> : <Trash2 />}
        </button>
      )}
    </li>
  );
}

function InfoEditor({ info, onClose }) {
  const dispatch = useAppDispatch();
  const [type, setType] = useState("work");
  const [values, setValues] = useState({ rel: RELATIONSHIPS[0] });
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await dispatch(addInfo({ type, ...values })).unwrap();
      setValues({ rel: RELATIONSHIPS[0] });
    } catch (message) {
      dispatch(toastError(message));
    }
    setBusy(false);
  };

  const remove = async (index) => {
    setRemoving(index);
    try {
      await dispatch(removeInfo(index)).unwrap();
    } catch (message) {
      dispatch(toastError(message));
    }
    setRemoving(null);
  };

  return (
    <Modal title="Edit details" onClose={onClose} footer={<button className="btn btn-primary" onClick={onClose}>Done</button>}>
      <div className="stack">
        {info.length > 0 && (
          <ul className="info-list editing">
            {info.map((item, i) => (
              <InfoLine key={item.id || i} info={item} busy={removing === i} onRemove={() => remove(i)} />
            ))}
          </ul>
        )}
        <form className="card card-pad stack info-form" onSubmit={save}>
          <span className="section-title">Add to your intro</span>
          <div className="info-types">
            {Object.entries(TYPES).map(([key, { label, Icon }]) => (
              <button type="button" key={key} className={`chip ${type === key ? "on" : ""}`} onClick={() => setType(key)}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
          {type === "relation" ? (
            <select className="select input" value={values.rel} onChange={(e) => setValues({ ...values, rel: e.target.value })}>
              {RELATIONSHIPS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          ) : (
            <div className="info-fields">
              {FIELDS[type].map((f) => (
                <input
                  key={f.key}
                  className="input"
                  placeholder={f.label + (f.required ? "" : " (optional)")}
                  value={values[f.key] || ""}
                  required={f.required}
                  maxLength={100}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
              ))}
            </div>
          )}
          {(type === "location" || type === "relation") && (
            <p className="faint" style={{ fontSize: 13 }}>
              This replaces your current {TYPES[type].label.toLowerCase()}.
            </p>
          )}
          <button className="btn btn-soft" disabled={busy}>
            {busy ? <Spinner size="sm" /> : <Plus />} Add
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default function Intro({ profile, isMe, extra = false }) {
  const [editing, setEditing] = useState(false);
  const info = profile.info || [];

  return (
    <div className="card card-pad">
      <div className="card-title">Intro</div>
      {profile.status && <p className="intro-bio prewrap">{profile.status}</p>}
      <ul className="info-list">
        {info.map((item, i) => (
          <InfoLine key={item.id || i} info={item} />
        ))}
        {profile.createdAt && (
          <li className="info-line">
            <CalendarDays />
            <span>Joined {fullDate(profile.createdAt)}</span>
          </li>
        )}
        {extra && profile.birthdate && (
          <li className="info-line">
            <CalendarDays />
            <span>Born {fullDate(profile.birthdate)}</span>
          </li>
        )}
      </ul>
      {isMe && (
        <button className="btn btn-secondary block" style={{ marginTop: 12 }} onClick={() => setEditing(true)}>
          <Pencil /> Edit details
        </button>
      )}
      {editing && <InfoEditor info={info} onClose={() => setEditing(false)} />}
    </div>
  );
}

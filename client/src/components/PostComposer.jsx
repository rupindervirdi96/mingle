import { useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { useAppDispatch, useMe } from "../store";
import { createPost } from "../store/postsSlice";
import { toast, toastError } from "../store/uiSlice";
import { uploadImage } from "../lib/upload";
import { Avatar, Spinner } from "./ui";

export default function PostComposer() {
  const me = useMe();
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef();
  const textarea = useRef();

  const pick = (e) => {
    const chosen = e.target.files?.[0];
    e.target.value = "";
    if (!chosen) return;
    if (!chosen.type.startsWith("image/")) {
      dispatch(toastError("Please choose an image file."));
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const grow = (el) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy || (!text.trim() && !file)) return;
    setBusy(true);
    try {
      const image = file ? await uploadImage(file) : undefined;
      await dispatch(createPost({ text: text.trim(), image })).unwrap();
      setText("");
      clearImage();
      if (textarea.current) textarea.current.style.height = "auto";
      dispatch(toast({ title: "Posted!", tone: "success", duration: 2500 }));
    } catch (error) {
      dispatch(toastError(typeof error === "string" ? error : error.message));
    }
    setBusy(false);
  };

  const firstName = me.name.split(" ")[0];

  return (
    <form className="card composer" onSubmit={submit}>
      <div className="composer-top">
        <Avatar src={me.profilePic} name={me.name} size={44} />
        <textarea
          ref={textarea}
          className="composer-input"
          rows={1}
          placeholder={`What's on your mind, ${firstName}?`}
          value={text}
          maxLength={5000}
          onChange={(e) => {
            setText(e.target.value);
            grow(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
          }}
        />
      </div>
      {preview && (
        <div className="composer-preview">
          <img src={preview} alt="Selected" />
          <button type="button" className="icon-btn filled sm" onClick={clearImage} aria-label="Remove photo">
            <X />
          </button>
        </div>
      )}
      <div className="composer-bar">
        <button type="button" className="btn btn-ghost sm composer-photo" onClick={() => fileInput.current.click()}>
          <ImagePlus /> Photo
        </button>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={pick} />
        <span className="grow" />
        {text.length > 4500 && <span className="faint" style={{ fontSize: 12 }}>{5000 - text.length}</span>}
        <button className="btn btn-primary sm" disabled={busy || (!text.trim() && !file)}>
          {busy ? <Spinner size="sm" light /> : <Send />}
          {busy ? (file ? "Uploading…" : "Posting…") : "Post"}
        </button>
      </div>
    </form>
  );
}

import store from "../store";

const MAX_BYTES = 10 * 1024 * 1024;

// Uploads an image straight to Cloudinary with the unsigned preset and returns its https URL.
export async function uploadImage(file) {
  if (!file) throw new Error("No file selected.");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > MAX_BYTES) throw new Error("Images must be smaller than 10 MB.");

  const { cloudName, uploadPreset } = store.getState().auth.config?.cloudinary || {};
  if (!cloudName || !uploadPreset) throw new Error("Image uploads are not configured.");

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Upload failed. Please try again.");
  }
  return data.secure_url;
}

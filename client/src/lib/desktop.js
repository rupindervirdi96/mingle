import { navigate } from "./navigation";

export const desktopSupported = () => typeof window !== "undefined" && "Notification" in window;

export const desktopPermission = () => (desktopSupported() ? Notification.permission : "unsupported");

export const requestDesktopPermission = async () => {
  if (!desktopSupported()) return "unsupported";
  return Notification.requestPermission();
};

// Shows a system notification, but only while Mingle is in a background tab.
export function showDesktop({ title, body, icon, link, tag }) {
  if (desktopPermission() !== "granted" || !document.hidden) return;
  try {
    const n = new Notification(title, { body, icon: icon || "/favicon.svg", tag });
    n.onclick = () => {
      window.focus();
      if (link) navigate(link);
      n.close();
    };
  } catch {
    // Some browsers (Android Chrome) only allow notifications from a service worker.
  }
}

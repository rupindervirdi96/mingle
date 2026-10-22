import axios from "axios";

const TOKEN_KEY = "mingle:token";

export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Storage can be unavailable (private mode); the session just won't persist.
    }
  },
};

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && tokenStore.get()) onUnauthorized();
    return Promise.reject(error);
  }
);

// Turns any axios failure into a message that is safe to show to the user.
export const errorMessage = (error) =>
  error?.response?.data?.message ||
  (error?.request && !error?.response
    ? "Can't reach Mingle right now. Check your connection."
    : error?.message) ||
  "Something went wrong.";

export default api;

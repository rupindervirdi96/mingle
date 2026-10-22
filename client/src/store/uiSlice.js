import { createSlice, nanoid } from "@reduxjs/toolkit";

const THEME_KEY = "mingle:theme";

const readTheme = () => {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    if (theme === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Theme just won't be remembered.
  }
};

const uiSlice = createSlice({
  name: "ui",
  initialState: { toasts: [], theme: readTheme() },
  reducers: {
    pushToast(state, { payload }) {
      state.toasts = [...state.toasts.slice(-3), payload];
    },
    dismissToast(state, { payload }) {
      state.toasts = state.toasts.filter((t) => t.id !== payload);
    },
    setTheme(state, { payload }) {
      state.theme = payload;
    },
  },
});

export const { pushToast, dismissToast, setTheme } = uiSlice.actions;

// toast({ title, body?, avatar?, name?, link?, tone?: "info" | "error" | "success" })
export const toast = (t) => (dispatch) => {
  const id = nanoid();
  dispatch(pushToast({ tone: "info", ...t, id }));
  setTimeout(() => dispatch(dismissToast(id)), t.duration || 5000);
};

export const toastError = (message) => toast({ title: message, tone: "error" });

export default uiSlice.reducer;

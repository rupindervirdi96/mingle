import { createSlice } from "@reduxjs/toolkit";
import api, { tokenStore } from "../api/client";
import { thunk } from "./thunk";

export const loadConfig = thunk("auth/config", async () => (await api.get("/auth/config")).data);

export const bootstrap = thunk("auth/bootstrap", async (_, { rejectWithValue }) => {
  if (!tokenStore.get()) return null;
  try {
    return (await api.get("/auth/me")).data;
  } catch (error) {
    if (error.response?.status === 401) {
      tokenStore.set(null);
      return null;
    }
    return rejectWithValue("offline");
  }
});

export const login = thunk("auth/login", async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  tokenStore.set(data.token);
  return data.profile;
});

export const sendCode = thunk("auth/sendCode", async (email) => (await api.post("/auth/send-code", { email })).data);

export const register = thunk("auth/register", async (details) => {
  const { data } = await api.post("/auth/register", details);
  tokenStore.set(data.token);
  return data.profile;
});

export const updateProfile = thunk("auth/updateProfile", async (changes) => (await api.patch("/profiles/me", changes)).data);

export const addInfo = thunk("auth/addInfo", async (entry) => (await api.post("/profiles/me/info", entry)).data);

export const removeInfo = thunk("auth/removeInfo", async (index) => (await api.delete(`/profiles/me/info/${index}`)).data);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // checking -> (authed | guest | offline)
    status: "checking",
    profile: null,
    config: null,
  },
  reducers: {
    loggedOut(state) {
      state.status = "guest";
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConfig.fulfilled, (state, { payload }) => {
        state.config = payload;
      })
      .addCase(bootstrap.pending, (state) => {
        state.status = "checking";
      })
      .addCase(bootstrap.fulfilled, (state, { payload }) => {
        state.profile = payload;
        state.status = payload ? "authed" : "guest";
      })
      .addCase(bootstrap.rejected, (state) => {
        state.status = "offline";
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.profile = payload;
        state.status = "authed";
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.profile = payload;
        state.status = "authed";
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.profile = payload;
      })
      .addCase(addInfo.fulfilled, (state, { payload }) => {
        state.profile.info = payload;
      })
      .addCase(removeInfo.fulfilled, (state, { payload }) => {
        state.profile.info = payload;
      });
  },
});

export const { loggedOut } = authSlice.actions;
export default authSlice.reducer;

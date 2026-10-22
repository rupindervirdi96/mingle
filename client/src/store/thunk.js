import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorMessage } from "../api/client";

// createAsyncThunk whose rejections carry a user-facing message as the payload.
export const thunk = (type, fn) =>
  createAsyncThunk(type, async (arg, tools) => {
    try {
      return await fn(arg, tools);
    } catch (error) {
      return tools.rejectWithValue(errorMessage(error));
    }
  });

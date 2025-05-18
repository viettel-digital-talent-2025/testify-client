"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/modules/shared/store/store";

export type AuthState = {
  accessToken?: string;
};

const initialState: AuthState = {
  accessToken: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>): void => {
      state.accessToken = action.payload;
    },

    setSignOut: (state): void => {
      state.accessToken = undefined;
    },
  },
});

export default authSlice.reducer;

export const { setAccessToken, setSignOut } = authSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

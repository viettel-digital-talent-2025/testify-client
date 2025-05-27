"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/shared/store/store";
import { User } from "@/auth/types/auth";

export type AuthState = {
  user?: User;
  accessToken?: string;
};

const initialState: AuthState = {
  user: undefined,
  accessToken: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>): void => {
      state.accessToken = action.payload;
    },

    setUser: (state, action: PayloadAction<User>): void => {
      state.user = action.payload;
    },

    setLogout: (state): void => {
      state.user = undefined;
      state.accessToken = undefined;
    },
  },
});

export default authSlice.reducer;

export const { setAccessToken, setUser, setLogout } = authSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUser = (state: RootState) => state.auth.user;

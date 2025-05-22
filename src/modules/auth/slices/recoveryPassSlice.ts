"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/modules/shared/store/store";

export type RecoveryPassState = {
  email?: string;
  otp?: string;
};

const initialState: RecoveryPassState = {
  email: undefined,
  otp: undefined,
};

const recoveryPassSlice = createSlice({
  name: "recoveryPass",
  initialState: initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>): void => {
      state.email = action.payload;
    },

    setOtp: (state, action: PayloadAction<string>): void => {
      state.otp = action.payload;
    },

    reset: (state): void => {
      state.email = undefined;
      state.otp = undefined;
    },
  },
});

export default recoveryPassSlice.reducer;

export const { setEmail, setOtp, reset } = recoveryPassSlice.actions;

export const selectEmail = (state: RootState) => state.recoveryPass.email;
export const selectOtp = (state: RootState) => state.recoveryPass.otp;

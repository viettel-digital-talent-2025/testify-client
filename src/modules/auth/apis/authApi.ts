"use client";
import { appApi } from "@/shared/store/api/appApi";
import {
  RegisterResponse,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/auth/types/auth";
import { store } from "@/shared/store/store";
import { setAccessToken, setLogout, setUser } from "../slices/authSlide";

export const authApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (params) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        const res = await queryFulfilled;
        store.dispatch(setUser(res.data.user));
        store.dispatch(setAccessToken(res.data.accessToken));
      },
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (params) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        const res = await queryFulfilled;
        store.dispatch(setUser(res.data.user));
        store.dispatch(setAccessToken(res.data.accessToken));
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(setLogout());
      },
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: (params) => ({
        url: "/api/v1/auth/refresh-token",
        method: "POST",
        body: params,
      }),
    }),

    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (params) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body: params,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (params) => ({
        url: "/api/v1/auth/verify-otp",
        method: "POST",
        body: params,
      }),
    }),

    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (params) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body: params,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;

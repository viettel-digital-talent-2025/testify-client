"use client";
import { appApi } from "@/modules/shared/store/api/appApi";
import {
  RegisterResponse,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
} from "@/modules/auth/types/auth";
import { store } from "@/modules/shared/store/store";
import { setAccessToken } from "./authSlide";

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
        store.dispatch(setAccessToken(res.data.accessToken));
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "DELETE",
      }),
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
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
} = authApi;

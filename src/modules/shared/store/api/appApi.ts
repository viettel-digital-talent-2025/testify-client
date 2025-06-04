"use client";
import { setAccessToken, setLogout } from "@/auth/slices/authSlide";
import { RefreshTokenResponse } from "@/auth/types/auth";
import { RootState } from "@/shared/store/store";
import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshToken = async (
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>,
) => {
  try {
    const result = await baseQuery(
      "/api/v1/auth/refresh-token",
      api,
      extraOptions,
    );
    if (result.data) {
      const data = result.data as RefreshTokenResponse;
      api.dispatch(setAccessToken(data.accessToken));
      return data.accessToken;
    } else {
      api.dispatch(setLogout());
      return null;
    }
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken(api, extraOptions);
    }

    const newAccessToken = await refreshPromise;

    if (newAccessToken) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setLogout());
    }
  }

  return result;
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "Scenario",
    "ScenarioGroup",
    "RunHistory",
    "RealtimeMetrics",
    "Schedule",
    "Bottlenecks",
  ],
});

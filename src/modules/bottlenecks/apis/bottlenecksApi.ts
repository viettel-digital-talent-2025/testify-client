"use client";
import { appApi } from "@/shared/store/api/appApi";
import { BottleneckRunHistory, BottlenecksGroup } from "../types/bottleneck";

export const bottlenecksApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getBottlenecksRunHistory: builder.query<BottlenecksGroup[], void>({
      query: () => ({
        url: "api/v1/bottlenecks/run-history",
        method: "GET",
      }),
      providesTags: ["Bottlenecks"],
    }),

    getBottlenecksByRunHistoryId: builder.query<
      BottleneckRunHistory,
      { runHistoryId: string }
    >({
      query: ({ runHistoryId }) => ({
        url: `api/v1/bottlenecks/run-history/${runHistoryId}`,
        method: "GET",
      }),
      providesTags: ["Bottlenecks"],
    }),
  }),
});

export const {
  useGetBottlenecksRunHistoryQuery,
  useGetBottlenecksByRunHistoryIdQuery,
} = bottlenecksApi;

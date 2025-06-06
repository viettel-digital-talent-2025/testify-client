"use client";
import { appApi } from "@/shared/store/api/appApi";
import {
  GetRunHistoryRequest,
  RunHistoryListResponse,
} from "../types/runHistory";

export const runHistoriesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRunHistories: builder.query<
      RunHistoryListResponse,
      GetRunHistoryRequest
    >({
      query: ({ scenarioId, ...params }) => ({
        url: `api/v1/run-history/scenario/${scenarioId}`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "RunHistory" as const,
                id,
              })),
              { type: "RunHistory", id: "LIST" },
            ]
          : [{ type: "RunHistory", id: "LIST" }],
    }),
  }),
});

export const { useGetRunHistoriesQuery } = runHistoriesApi;

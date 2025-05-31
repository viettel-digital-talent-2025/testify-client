"use client";
import { appApi } from "@/shared/store/api/appApi";
import {
  CreateRunHistoryRequest,
  GetRunHistoryRequest,
  RunHistoryListResponse,
  RunHistoryWithMetrics,
  UpdateRunHistoryRequest,
} from "../types/runHistory";

export const runHistoriesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRunHistory: builder.query<RunHistoryWithMetrics, string>({
      query: (id) => ({
        url: `api/v1/run-history/${id}`,
        method: "GET",
      }),
      providesTags: (result, _error, id) =>
        result ? [{ type: "RunHistory", id }] : [],
    }),

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

    createRunHistory: builder.mutation<
      RunHistoryWithMetrics,
      CreateRunHistoryRequest
    >({
      query: (data) => ({
        url: "run-history",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "RunHistory", id: "LIST" }],
    }),

    updateRunHistory: builder.mutation<
      RunHistoryWithMetrics,
      { id: string; data: UpdateRunHistoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `run-history/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "RunHistory", id },
        { type: "RunHistory", id: "LIST" },
      ],
    }),

    deleteRunHistory: builder.mutation<RunHistoryWithMetrics, string>({
      query: (id) => ({
        url: `run-history/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "RunHistory", id },
        { type: "RunHistory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRunHistoryQuery,
  useGetRunHistoriesQuery,
  useCreateRunHistoryMutation,
  useUpdateRunHistoryMutation,
  useDeleteRunHistoryMutation,
} = runHistoriesApi;

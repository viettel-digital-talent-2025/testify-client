"use client";
import { RunHistoryWithMetrics } from "@/scenarios/types/runHistory";
import { appApi } from "@/shared/store/api/appApi";

export const loadTestApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    runLoadTest: builder.mutation<RunHistoryWithMetrics, string>({
      query: (scenarioId) => ({
        url: `api/v1/load-tests/${scenarioId}/run`,
        method: "POST",
      }),
    }),

    stopLoadTest: builder.mutation<RunHistoryWithMetrics, string>({
      query: (id) => ({
        url: `api/v1/load-tests/${id}/stop`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useRunLoadTestMutation, useStopLoadTestMutation } = loadTestApi;

"use client";
import {
  RealtimeMetricsQueryParams,
  RealtimeMetricsResponse,
} from "@/scenarios/types/metrics";
import { appApi } from "@/shared/store/api/appApi";

export const metricsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<
      RealtimeMetricsResponse,
      RealtimeMetricsQueryParams
    >({
      query: ({ scenarioId, duration, flowId, stepId, runHistoryId }) => ({
        url: `api/v1/metrics/${scenarioId}/${runHistoryId}`,
        method: "GET",
        params: {
          duration,
          flow_id: flowId,
          step_id: stepId,
        },
      }),
    }),
  }),
});

export const { useGetMetricsQuery } = metricsApi;

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
      query: ({ scenarioId, runHistoryId, flowId, stepId, ...rest }) => ({
        url: `api/v1/metrics/${scenarioId}/${runHistoryId}`,
        method: "GET",
        params: {
          flow_id: flowId,
          step_id: stepId,
          ...rest,
        },
      }),
    }),
  }),
});

export const { useGetMetricsQuery } = metricsApi;

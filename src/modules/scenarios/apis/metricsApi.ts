"use client";
import {
  RealtimeMetricsQueryParams,
  RealtimeMetricsResponse,
} from "@/scenarios/types/metrics";
import { appApi } from "@/shared/store/api/appApi";
import { setRunningJobStatus } from "../slices/metricsSlice";
import { RunHistoryStatus } from "../types/runHistory";

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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const metrics = res.data;
        if (metrics.status !== RunHistoryStatus.RUNNING) {
          dispatch(
            setRunningJobStatus({
              scenarioId: metrics.scenarioId,
              runHistoryId: metrics.runHistoryId,
              status: metrics.status,
            }),
          );
        }
      },
    }),
  }),
});

export const { useGetMetricsQuery } = metricsApi;

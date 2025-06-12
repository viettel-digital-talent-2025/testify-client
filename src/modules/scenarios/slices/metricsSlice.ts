"use client";
import { RunHistoryStatus } from "@/scenarios/types/runHistory";
import { RootState } from "@/shared/store/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MetricsState {
  runningJobs: Record<
    string,
    {
      scenarioId: string;
      isRunning: boolean;
    }
  >;
}

const initialState: MetricsState = {
  runningJobs: {},
};

const metricsSlice = createSlice({
  name: "metrics",
  initialState: initialState,
  reducers: {
    setRunningJob: (
      state,
      action: PayloadAction<{
        scenarioId: string;
        runHistoryId: string;
        isRunning: boolean;
      }>,
    ) => {
      const { scenarioId, runHistoryId, isRunning } = action.payload;
      if (!scenarioId || !runHistoryId) return;
      state.runningJobs[runHistoryId] = {
        scenarioId,
        isRunning,
      };
    },

    setRunningJobStatus: (
      state,
      action: PayloadAction<{
        scenarioId: string;
        runHistoryId: string;
        status: RunHistoryStatus;
      }>,
    ) => {
      if (
        !Object.values(RunHistoryStatus).includes(
          action.payload.status as RunHistoryStatus,
        )
      ) {
        return;
      }

      const { scenarioId, runHistoryId, status } = action.payload;
      if (!scenarioId || !runHistoryId) return;

      state.runningJobs[runHistoryId] = {
        scenarioId,
        isRunning: status === RunHistoryStatus.RUNNING,
      };
    },
  },
});

export default metricsSlice.reducer;

export const { setRunningJob, setRunningJobStatus } = metricsSlice.actions;

export const selectIsRunningJobByRunHistoryId = createSelector(
  (state: RootState) => state.metrics.runningJobs,
  (_: RootState, runHistoryId?: string | null) => runHistoryId,
  (runningJobs, runHistoryId) => {
    if (!runHistoryId) return false;
    return Object.entries(runningJobs).some(
      ([key, job]) => key === runHistoryId && job.isRunning,
    );
  },
);

export const selectIsRunningJobByScenarioId = createSelector(
  (state: RootState) => state.metrics.runningJobs,
  (_: RootState, scenarioId?: string | null) => scenarioId,
  (runningJobs, scenarioId) => {
    if (!scenarioId) return false;
    return Object.values(runningJobs).some(
      (job) => job.scenarioId === scenarioId && job.isRunning,
    );
  },
);

export const selectIsRunningJob = createSelector(
  (state: RootState) => state.metrics.runningJobs,
  (runningJobs) => Object.values(runningJobs).some((job) => job.isRunning),
);

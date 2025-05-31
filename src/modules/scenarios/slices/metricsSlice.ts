"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/shared/store/store";
import { RunHistoryStatus } from "@/scenarios/types/runHistory";

export interface MetricsState {
  isScenarioRunning: Record<string, boolean>;
  runHistoryStatus: RunHistoryStatus | null;
}

const initialState: MetricsState = {
  isScenarioRunning: {},
  runHistoryStatus: null,
};

const metricsSlice = createSlice({
  name: "metrics",
  initialState: initialState,
  reducers: {
    setScenarioRunning: (
      state,
      action: PayloadAction<{ scenarioId: string; isRunning: boolean }>,
    ) => {
      state.isScenarioRunning[action.payload.scenarioId] =
        action.payload.isRunning;
    },

    setScenarioRunningStatus: (
      state,
      action: PayloadAction<{ scenarioId: string; status: RunHistoryStatus }>,
    ) => {
      if (
        !Object.values(RunHistoryStatus).includes(
          action.payload.status as RunHistoryStatus,
        )
      ) {
        return;
      }

      state.isScenarioRunning[action.payload.scenarioId] =
        action.payload.status === RunHistoryStatus.RUNNING;
    },
  },
});

export default metricsSlice.reducer;

export const { setScenarioRunning, setScenarioRunningStatus } =
  metricsSlice.actions;

export const selectIsScenarioRunning = (state: RootState, scenarioId: string) =>
  state.metrics.isScenarioRunning[scenarioId];

export const selectRunHistoryStatus = (state: RootState) =>
  state.metrics.runHistoryStatus;

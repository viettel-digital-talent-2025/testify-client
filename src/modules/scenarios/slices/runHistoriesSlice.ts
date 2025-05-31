"use client";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RunHistoryParams, RunHistory } from "../types/runHistory";
import { RootState } from "@/shared/store/store";

export interface RunHistoryState {
  params: RunHistoryParams;
  selectedRun: RunHistory | null;
  selectedRuns: Record<string, RunHistory[]>;
  isDetailModalVisible: boolean;
  isCompareModalVisible: boolean;
}

const initialState: RunHistoryState = {
  params: {
    search: "",
    skip: 0,
    take: 5,
    order: "desc",
    orderBy: "runAt",
    status: [],
    startTime: null,
    endTime: null,
  },
  selectedRun: null,
  selectedRuns: {},
  isDetailModalVisible: false,
  isCompareModalVisible: false,
};

const runHistoriesSlice = createSlice({
  name: "runHistories",
  initialState: initialState,
  reducers: {
    setParams: (
      state: RunHistoryState,
      action: PayloadAction<Partial<RunHistoryParams>>,
    ) => {
      state.params = { ...state.params, ...action.payload };
    },

    setSelectedRun: (
      state: RunHistoryState,
      action: PayloadAction<RunHistory>,
    ) => {
      state.selectedRun = action.payload;
    },

    setSelectedRuns: (
      state: RunHistoryState,
      action: PayloadAction<{ scenarioId: string; runs: RunHistory[] }>,
    ) => {
      state.selectedRuns[action.payload.scenarioId] = action.payload.runs;
    },

    setIsDetailModalVisible: (
      state: RunHistoryState,
      action: PayloadAction<boolean>,
    ) => {
      state.isDetailModalVisible = action.payload;
    },

    setIsCompareModalVisible: (
      state: RunHistoryState,
      action: PayloadAction<boolean>,
    ) => {
      state.isCompareModalVisible = action.payload;
    },
  },
});

export default runHistoriesSlice.reducer;

export const {
  setParams,
  setSelectedRun,
  setSelectedRuns,
  setIsDetailModalVisible,
  setIsCompareModalVisible,
} = runHistoriesSlice.actions;

export const selectRunHistoryParams = (state: RootState) =>
  state.runHistories.params;

export const selectSelectedRun = (state: RootState) =>
  state.runHistories.selectedRun;

export const selectSelectedRuns = createSelector(
  [
    (state: RootState) => state.runHistories.selectedRuns,
    (state: RootState) => state.scenarios.selectedScenarioId,
  ],
  (selectedRuns, scenarioId) => {
    if (!scenarioId) return [];
    return selectedRuns[scenarioId] ?? [];
  },
);

export const selectSelectedRunIds = createSelector(
  [selectSelectedRuns],
  (runs) => runs.map((run) => run.id),
);

export const selectIsDetailModalVisible = (state: RootState) =>
  state.runHistories.isDetailModalVisible;

export const selectIsCompareModalVisible = (state: RootState) =>
  state.runHistories.isCompareModalVisible;

"use client";
import { RootState } from "@/shared/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ViewMode = "by-flow" | "by-severity";

export type BottlenecksState = {
  selectedBottleneckId: string | null;
  selectedRunHistoryId: string | null;
  viewMode: ViewMode;
};

const initialState: BottlenecksState = {
  selectedBottleneckId: null,
  selectedRunHistoryId: null,
  viewMode: "by-flow",
};

const bottlenecksSlice = createSlice({
  name: "bottlenecks",
  initialState: initialState,
  reducers: {
    setSelectedBottleneckId: (
      state,
      action: PayloadAction<string | null>,
    ): void => {
      state.selectedBottleneckId = action.payload;
    },

    setSelectedRunHistoryId: (
      state,
      action: PayloadAction<string | null>,
    ): void => {
      state.selectedRunHistoryId = action.payload;
    },

    setViewMode: (state, action: PayloadAction<ViewMode>): void => {
      state.viewMode = action.payload;
    },
  },
});

export default bottlenecksSlice.reducer;

export const { setSelectedBottleneckId, setSelectedRunHistoryId, setViewMode } =
  bottlenecksSlice.actions;

export const selectSelectedBottleneckId = (state: RootState) =>
  state.bottlenecks.selectedBottleneckId;

export const selectSelectedRunHistoryId = (state: RootState) =>
  state.bottlenecks.selectedRunHistoryId;

export const selectViewMode = (state: RootState) => state.bottlenecks.viewMode;

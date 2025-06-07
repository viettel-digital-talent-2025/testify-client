"use client";
import { BottleneckSeverity } from "@/bottlenecks/types/bottleneck";
import { RootState } from "@/shared/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Scenario } from "../types/scenario";

interface SelectedStep {
  flowId: string;
  stepId?: string;
  flowName: string;
  stepName?: string;
}

export type ScenariosState = {
  selectedGroupId: string | null;
  selectedScenarioId: string | null;
  selectedScenario: Scenario | null;
  selectedSteps: SelectedStep[];
  selectedSeverity: BottleneckSeverity[];
};

const initialState: ScenariosState = {
  selectedGroupId: null,
  selectedScenarioId: null,
  selectedScenario: null,
  selectedSteps: [],
  selectedSeverity: [],
};

const scenariosSlice = createSlice({
  name: "scenarios",
  initialState: initialState,
  reducers: {
    setSelectedGroupId: (state, action: PayloadAction<string | null>): void => {
      state.selectedGroupId = action.payload;
    },

    setSelectedScenarioId: (
      state,
      action: PayloadAction<string | null>,
    ): void => {
      state.selectedScenarioId = action.payload;
    },

    setSelectedScenario: (
      state,
      action: PayloadAction<Scenario | null>,
    ): void => {
      state.selectedScenario = action.payload;
    },

    setSelectedSteps: (state, action: PayloadAction<SelectedStep[]>): void => {
      state.selectedSteps = action.payload;
    },

    setSelectedSeverity: (
      state,
      action: PayloadAction<BottleneckSeverity[]>,
    ): void => {
      state.selectedSeverity = action.payload;
    },
  },
});

export default scenariosSlice.reducer;

export const {
  setSelectedGroupId,
  setSelectedScenarioId,
  setSelectedScenario,
  setSelectedSteps,
  setSelectedSeverity,
} = scenariosSlice.actions;

export const selectSelectedGroupId = (state: RootState) =>
  state.scenarios.selectedGroupId;

export const selectSelectedScenarioId = (state: RootState) =>
  state.scenarios.selectedScenarioId;

export const selectSelectedScenario = (state: RootState) =>
  state.scenarios.selectedScenario;

export const selectSelectedSteps = (state: RootState) =>
  state.scenarios.selectedSteps;

export const selectSelectedSeverity = (state: RootState) =>
  state.scenarios.selectedSeverity;

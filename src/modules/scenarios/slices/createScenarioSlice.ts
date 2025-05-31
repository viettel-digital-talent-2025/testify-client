"use client";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/shared/store/store";
import { ScenarioType, ScenarioFlowType } from "@/scenarios/types/scenario";
import { ScenarioStrategy } from "@/scenarios/strategies";

export type CreateScenarioState = {
  scenarioStrategy: ScenarioStrategy | null;
  type: ScenarioType;
  flow: ScenarioFlowType;
};

const initialState: CreateScenarioState = {
  scenarioStrategy: null,
  type: ScenarioType.WEB,
  flow: ScenarioFlowType.SIMPLE,
};

const createScenarioSlice = createSlice({
  name: "createScenario",
  initialState: initialState,
  reducers: {
    setScenarioStrategy: (state, action: PayloadAction<ScenarioStrategy>) => {
      state.scenarioStrategy = action.payload;
    },

    setType: (state, action: PayloadAction<ScenarioType>) => {
      state.type = action.payload;
    },

    setFlow: (state, action: PayloadAction<ScenarioFlowType>) => {
      state.flow = action.payload;
    },
  },
});

export default createScenarioSlice.reducer;

export const { setScenarioStrategy, setType, setFlow } =
  createScenarioSlice.actions;

// Selectors
export const selectCreateScenarioState = createSelector(
  (state: RootState) => state.createScenario,
  (createScenarioState) => createScenarioState,
);

export const selectType = createSelector(
  (state: RootState) => state.createScenario.type,
  (type) => type,
);
export const selectFlow = createSelector(
  (state: RootState) => state.createScenario.flow,
  (flow) => flow,
);

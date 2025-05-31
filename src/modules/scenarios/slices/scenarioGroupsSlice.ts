"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/shared/store/store";
import { ScenarioGroup } from "../types/scenarioGroup";

export type ScenarioGroupState = {
  isDragging: boolean;
  newGroupOpen: boolean;
  editGroupOpen: boolean;
  currentGroup: ScenarioGroup | null;
  currentEditGroup: ScenarioGroup | null;
};

const initialState: ScenarioGroupState = {
  isDragging: false,
  newGroupOpen: false,
  editGroupOpen: false,
  currentGroup: null,
  currentEditGroup: null,
};

const scenarioGroupsSlice = createSlice({
  name: "scenarioGroups",
  initialState: initialState,
  reducers: {
    setIsDragging: (state, action: PayloadAction<boolean>): void => {
      state.isDragging = action.payload;
    },

    setReverseIsDragging: (state) => {
      state.isDragging = !state.isDragging;
    },

    setNewGroupOpen: (state, action: PayloadAction<boolean>): void => {
      state.newGroupOpen = action.payload;
    },

    setEditGroupOpen: (state, action: PayloadAction<boolean>): void => {
      state.editGroupOpen = action.payload;
    },

    setCurrentGroup: (
      state,
      action: PayloadAction<ScenarioGroup | null>,
    ): void => {
      state.currentGroup = action.payload;
    },

    setCurrentEditGroup: (
      state,
      action: PayloadAction<ScenarioGroup | null>,
    ): void => {
      state.currentEditGroup = action.payload;
    },
  },
});

export default scenarioGroupsSlice.reducer;

export const {
  setIsDragging,
  setReverseIsDragging,
  setNewGroupOpen,
  setEditGroupOpen,
  setCurrentGroup,
  setCurrentEditGroup,
} = scenarioGroupsSlice.actions;

export const selectIsDragging = (state: RootState) =>
  state.scenarioGroups.isDragging;

export const selectNewGroupOpen = (state: RootState) =>
  state.scenarioGroups.newGroupOpen;

export const selectEditGroupOpen = (state: RootState) =>
  state.scenarioGroups.editGroupOpen;

export const selectCurrentGroup = (state: RootState) =>
  state.scenarioGroups.currentGroup;

export const selectCurrentEditGroup = (state: RootState) =>
  state.scenarioGroups.currentEditGroup;

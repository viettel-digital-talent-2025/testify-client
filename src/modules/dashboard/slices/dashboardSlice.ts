import { RootState } from "@/shared/store/store";
import { createSlice } from "@reduxjs/toolkit";

export interface DashboardState {
  selectedRunHistory: {
    runHistoryId: string;
    scenarioId: string;
  } | null;
}

const initialState: DashboardState = {
  selectedRunHistory: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedRunHistory: (state, action) => {
      state.selectedRunHistory = action.payload;
    },
  },
});

export default dashboardSlice.reducer;

export const { setSelectedRunHistory } = dashboardSlice.actions;

export const selectSelectedRunHistory = (state: RootState) =>
  state.dashboard.selectedRunHistory;

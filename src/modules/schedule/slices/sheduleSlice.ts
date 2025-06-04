"use client";
import { RootState } from "@/shared/store/store";
import { createSlice } from "@reduxjs/toolkit";
import { Schedule } from "../types/schedule";

export interface ScheduleState {
  isModalOpen: boolean;
  schedule: Schedule | null;
  schedules: Schedule[];
}

const initialState: ScheduleState = {
  isModalOpen: false,
  schedule: null,
  schedules: [],
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: initialState,
  reducers: {
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },

    setSchedule: (state, action) => {
      state.schedule = action.payload;
    },

    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
  },
});

export default scheduleSlice.reducer;

export const { setIsModalOpen, setSchedule, setSchedules } =
  scheduleSlice.actions;

export const selectIsModalOpen = (state: RootState) =>
  state.schedule.isModalOpen;

export const selectSchedule = (state: RootState) => state.schedule.schedule;

export const selectSchedules = (state: RootState) => state.schedule.schedules;

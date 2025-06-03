"use client";
import { appApi } from "@/shared/store/api/appApi";
import {
  ScheduleResponse,
  SchedulersResponse,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from "../types/schedule";

export const scheduleApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<SchedulersResponse, void>({
      query: () => ({
        url: "/api/v1/scheduler",
        method: "GET",
      }),
      providesTags: ["Schedule"],
    }),

    createSchedule: builder.mutation<ScheduleResponse, CreateScheduleRequest>({
      query: (data) => ({
        url: "/api/v1/scheduler",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Schedule"],
    }),

    updateSchedule: builder.mutation<ScheduleResponse, UpdateScheduleRequest>({
      query: ({ id, ...data }) => ({
        url: `/api/v1/scheduler/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Schedule"],
    }),

    deleteSchedule: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/v1/scheduler/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Schedule"],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = scheduleApi;

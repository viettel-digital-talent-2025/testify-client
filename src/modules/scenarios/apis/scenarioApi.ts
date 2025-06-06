"use client";
import { setRunningJobStatus } from "@/scenarios/slices/metricsSlice";
import {
  CreateScenarioRequest,
  Scenario,
  UpdateScenarioRequest,
} from "@/scenarios/types/scenario";
import { appApi } from "@/shared/store/api/appApi";

export const scenarioApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getScenarios: builder.query<Scenario[], void>({
      query: () => ({
        url: "api/v1/scenarios",
        method: "GET",
      }),
      providesTags: () => [{ type: "Scenario", id: "LIST" }],
    }),

    getScenariosByGroup: builder.query<Scenario[], string | null>({
      query: (groupId) => ({
        url: `api/v1/scenarios/group/${groupId}`,
        method: "GET",
      }),
      providesTags: () => [{ type: "Scenario", id: "LIST" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const scenarios = res.data;
        scenarios.forEach((scenario) => {
          scenario.runHistories.forEach((runHistory) => {
            dispatch(
              setRunningJobStatus({
                scenarioId: scenario.id,
                runHistoryId: runHistory.id,
                status: runHistory.status,
              }),
            );
          });
        });
      },
    }),

    getScenario: builder.query<Scenario, string>({
      query: (id) => ({
        url: `api/v1/scenarios/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Scenario", id }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const scenario = res.data;
        dispatch(
          setRunningJobStatus({
            scenarioId: scenario.id,
            runHistoryId: scenario.runHistories[0]?.id,
            status: scenario.runHistories[0]?.status,
          }),
        );
      },
    }),

    createScenario: builder.mutation<Scenario, CreateScenarioRequest>({
      query: (data) => ({
        url: "api/v1/scenarios",
        method: "POST",
        body: data,
      }),
      invalidatesTags: () => [
        { type: "Scenario", id: "LIST" },
        { type: "ScenarioGroup", id: "LIST" },
      ],
    }),

    updateScenario: builder.mutation<Scenario, UpdateScenarioRequest>({
      query: ({ id, ...body }) => ({
        url: `api/v1/scenarios/${id}`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (result) => [
        { type: "Scenario", id: result?.id },
        { type: "Scenario", id: "LIST" },
        { type: "ScenarioGroup", id: "LIST" },
      ],
    }),

    deleteScenario: builder.mutation<Scenario, string>({
      query: (id) => ({
        url: `api/v1/scenarios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Scenario", id },
        { type: "Scenario", id: "LIST" },
        { type: "ScenarioGroup", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetScenariosQuery,
  useGetScenariosByGroupQuery,
  useGetScenarioQuery,
  useCreateScenarioMutation,
  useUpdateScenarioMutation,
  useDeleteScenarioMutation,
} = scenarioApi;

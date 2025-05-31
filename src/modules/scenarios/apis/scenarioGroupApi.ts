"use client";
import {
  CreateScenarioGroupRequest,
  CreateScenarioGroupResponse,
  GetScenarioGroupResponse,
  UpdateScenarioGroup,
} from "@/scenarios/types/scenarioGroup";
import { appApi } from "@/shared/store/api/appApi";

export const scenarioGroupApi = appApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getScenarioGroups: builder.query<GetScenarioGroupResponse, void>({
      query: () => "/api/v1/scenario-groups",
      providesTags: (result) =>
        result
          ? [
              ...result.scenarioGroups.map((group) => ({
                type: "ScenarioGroup" as const,
                id: group.id,
              })),
              { type: "ScenarioGroup", id: "LIST" },
            ]
          : [{ type: "ScenarioGroup", id: "LIST" }],
    }),

    createScenarioGroup: builder.mutation<
      CreateScenarioGroupResponse,
      CreateScenarioGroupRequest
    >({
      query: (group) => ({
        url: "/api/v1/scenario-groups",
        method: "POST",
        body: group,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          scenarioGroupApi.util.updateQueryData(
            "getScenarioGroups",
            undefined,
            (draft) => {
              draft.scenarioGroups.push({
                ...data?.scenarioGroup,
                scenarios: [],
              });
            },
          ),
        );
      },
    }),

    updateScenarioGroup: builder.mutation<void, UpdateScenarioGroup>({
      query: ({ id, ...group }) => ({
        url: `/api/v1/scenario-groups/${id}`,
        method: "PATCH",
        body: group,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          scenarioGroupApi.util.updateQueryData(
            "getScenarioGroups",
            undefined,
            (draft) => {
              const group = draft.scenarioGroups.find((g) => g.id === arg.id);
              if (group) {
                Object.assign(group, arg);
              }
            },
          ),
        );
      },
    }),

    deleteScenarioGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/scenario-groups/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          scenarioGroupApi.util.updateQueryData(
            "getScenarioGroups",
            undefined,
            (draft) => {
              draft.scenarioGroups = draft.scenarioGroups.filter(
                (group) => group.id !== id,
              );
            },
          ),
        );
      },
    }),
  }),
});

export const {
  useGetScenarioGroupsQuery,
  useCreateScenarioGroupMutation,
  useUpdateScenarioGroupMutation,
  useDeleteScenarioGroupMutation,
} = scenarioGroupApi;

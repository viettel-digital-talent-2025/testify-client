import {
  useCreateScenarioMutation,
  useDeleteScenarioMutation,
  useUpdateScenarioMutation,
} from "@/scenarios/apis/scenarioApi";

export const useScenario = () => {
  const [createScenario] = useCreateScenarioMutation();
  const [updateScenario] = useUpdateScenarioMutation();
  const [deleteScenario] = useDeleteScenarioMutation();

  return { createScenario, updateScenario, deleteScenario };
};

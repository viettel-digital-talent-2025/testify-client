import { ScenarioType, Scenario } from "./scenario";

export interface ScenarioGroup {
  id: string;
  name: string;
  description: string | null;
  scenarios: {
    id: string;
    name: string;
    type: ScenarioType;
  }[];
}

//=========== Get Scenario Group Types ============
export interface GetScenarioGroupResponse {
  scenarioGroups: ScenarioGroup[];
  scenarios: Scenario[];
}

//=========== Create Scenario Group Types ============
export interface CreateScenarioGroup {
  name: string;
  description: string | null;
}

//=========== Update Scenario Group Types ============
export interface UpdateScenarioGroup extends CreateScenarioGroup {
  id: string;
}

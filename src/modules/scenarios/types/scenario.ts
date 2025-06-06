import { Bottleneck } from "@/bottlenecks/types/bottleneck";
import {
  WebConfig,
  ApiConfig,
  WebConfigFormProps,
  ApiConfigFormProps,
} from "./config";
import { RunHistory } from "./runHistory";

export enum ScenarioType {
  WEB = "WEB",
  API = "API",
  DATABASE = "DATABASE",
  USER_FLOW = "USER_FLOW",
}

export enum ScenarioFlowType {
  SIMPLE = "SIMPLE",
  MULTI = "MULTI",
}

export enum ScenarioFlowStepType {
  BROWSER = "BROWSER",
  API = "API",
  SQL = "SQL",
  WAIT = "WAIT",
}

export interface ScenarioStep {
  id: string;
  flowId: string;
  name: string;
  description: string;
  type: ScenarioFlowStepType;
  config: WebConfig | ApiConfig;
  order: number;
  bottlenecks: Bottleneck[];
}

export interface ScenarioFlow {
  id: string;
  scenarioId: string;
  name: string;
  description: string;
  weight: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  steps: ScenarioStep[];
}

export interface Scenario {
  id: string;
  userId: string;
  groupId: string | null;
  name: string;
  description: string | null;
  type: ScenarioType;
  flowType: ScenarioFlowType;
  vus: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  flows: ScenarioFlow[];
  runHistories: RunHistory[];
}

//=========== Scenario Form Types ============
export interface ScenarioStepForm {
  name: string;
  description: string;
  type: ScenarioFlowStepType;
  config: WebConfigFormProps | ApiConfigFormProps;
}

//=========== Create Scenario Types ============
export interface CreateScenarioStep {
  name: string;
  description: string;
  type: ScenarioFlowStepType;
  config: WebConfig | ApiConfig;
  order: number;
}

export interface CreateScenarioFlow {
  name: string;
  description: string;
  weight: number;
  steps: CreateScenarioStep[];
  order: number;
}

export interface CreateScenarioRequest {
  groupId?: string;
  name: string;
  description?: string;
  type: ScenarioType;
  vus: number;
  duration: number;
  flows: CreateScenarioFlow[];
}

//=========== Update Scenario Types ============
export interface UpdateScenarioRequest extends CreateScenarioRequest {
  id: string;
}

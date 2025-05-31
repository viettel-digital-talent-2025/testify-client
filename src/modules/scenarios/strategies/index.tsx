import {
  ApiConfig,
  ApiConfigFormProps,
  WebConfig,
  WebConfigFormProps,
} from "@/scenarios/types/config";
import {
  CreateScenarioFlow,
  ScenarioStepForm,
  ScenarioType,
} from "@/scenarios/types/scenario";
import { ApiStrategy } from "./ApiStrategy";
import { WebStrategy } from "./webStategy";

export interface StepCardProps {
  name: string;
  config: WebConfigFormProps | ApiConfigFormProps;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ScenarioStrategy {
  getType(): ScenarioType;
  formatConfig(
    config: WebConfigFormProps | ApiConfigFormProps,
  ): WebConfig | ApiConfig;
  formatForm(
    config: WebConfig | ApiConfig,
  ): WebConfigFormProps | ApiConfigFormProps;
  createSimpleFlow(
    config?: WebConfigFormProps | ApiConfigFormProps,
    index?: number,
  ): CreateScenarioFlow[];
  createMultiFlow(flows: CreateScenarioFlow[]): CreateScenarioFlow[];
  createStep(
    config?: WebConfigFormProps | ApiConfigFormProps,
    index?: number,
  ): ScenarioStepForm;
  renderIcon(size: "small" | "medium" | "large"): React.ReactNode;
  renderForm(key?: string): React.ReactNode;
  renderStepCard(props: StepCardProps): React.ReactNode;
}

export function getScenarioStrategy(type: ScenarioType): ScenarioStrategy {
  switch (type) {
    case ScenarioType.WEB:
      return new WebStrategy();
    case ScenarioType.API:
      return new ApiStrategy();
    default:
      return new WebStrategy();
  }
}

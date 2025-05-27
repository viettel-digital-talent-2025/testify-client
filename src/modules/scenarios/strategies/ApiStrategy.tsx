import { Button, Tag, Tooltip, Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ScenarioStrategy, StepCardProps } from ".";
import {
  CreateScenarioFlow,
  ScenarioType,
  ScenarioFlowStepType,
  ScenarioStepForm,
} from "../types/scenario";
import { ApiConfigForm } from "@/scenarios/components/create/configs/simple";
import {
  ApiConfig,
  ApiConfigFormProps,
  BodyType,
  HttpMethod,
} from "../types/config";
import {
  getScenarioIconByType,
  getScenarioColorByType,
} from "../components/utils/scenarioUtils";
import { getMethodColor } from "@/scenarios/components/utils";
import Paragraph from "antd/es/typography/Paragraph";

export class ApiStrategy implements ScenarioStrategy {
  getType(): ScenarioType {
    return ScenarioType.API;
  }

  formatConfig(config: ApiConfigFormProps): ApiConfig {
    let headers: Record<string, string> | undefined = undefined;
    if (config?.headers) {
      headers = Object.fromEntries(
        config?.headers
          ?.filter((item) => item.key && item.value)
          .map(({ key, value }) => [key, value]),
      );
    }

    let payload: string | Record<string, string> | undefined = undefined;
    if (
      config?.bodyType === BodyType.FORM_DATA ||
      config?.bodyType === BodyType.URLENCODED
    ) {
      payload = Object.fromEntries(
        (config?.payload as Array<{ key: string; value: string }>)
          ?.filter((item) => item.key && item.value)
          .map(({ key, value }) => [key, value]),
      );
    } else {
      payload = config?.payload as string;
    }

    return {
      ...config,
      headers,
      payload,
    };
  }

  createSimpleFlow(
    config: ApiConfigFormProps = {
      endpoint: "https://example.com",
      method: HttpMethod.GET,
      headers: undefined,
      bodyType: BodyType.NONE,
      payload: undefined,
    },
    index: number = 0,
  ): CreateScenarioFlow[] {
    const formattedConfig = this.formatConfig(config);

    if (index === 0) {
      return [
        {
          name: "Main Flow",
          description: "API simple flow",
          weight: 100,
          steps: [
            {
              name: "API Step",
              description: "Load test an API",
              type: ScenarioFlowStepType.API,
              config: formattedConfig,
            },
          ],
        },
      ];
    }

    return [
      {
        name: `Flow ${index + 1}`,
        description: `API simple flow ${index + 1}`,
        weight: 0,
        steps: [
          {
            name: "API Step",
            description: "Load test an API",
            type: ScenarioFlowStepType.API,
            config: formattedConfig,
          },
        ],
      },
    ];
  }

  createMultiFlow(flows: CreateScenarioFlow[]): CreateScenarioFlow[] {
    return flows.map((flow) => ({
      ...flow,
      steps: flow.steps.map((step) => ({
        ...step,
        config: this.formatConfig(step.config as ApiConfigFormProps),
      })),
    }));
  }

  createStep(
    config: ApiConfigFormProps = {
      endpoint: "https://example.com",
      method: HttpMethod.GET,
      headers: undefined,
      bodyType: BodyType.NONE,
      payload: undefined,
    },
    index?: number,
  ): ScenarioStepForm {
    return {
      name: `API Step${index ? ` ${index + 1}` : ""}`,
      description: "Load test an API",
      type: ScenarioFlowStepType.API,
      config,
    };
  }

  renderIcon(size: "small" | "medium" | "large") {
    return getScenarioIconByType({ type: ScenarioType.API, size });
  }

  renderForm(key?: string): React.ReactNode {
    return <ApiConfigForm key={key} />;
  }

  renderStepCard(props: StepCardProps): React.ReactNode {
    const { name, config, onEdit, onDelete } = props;
    const { endpoint, method } = config as ApiConfigFormProps;

    return (
      <Card style={{ width: "100%" }}>
        <Tooltip>
          <div className="flex gap-2">
            {getScenarioIconByType({ type: ScenarioType.API })}
            <div className="flex-1">
              <Paragraph ellipsis style={{ marginBottom: 8 }}>
                {name}{" "}
                <Tag color={getScenarioColorByType(ScenarioType.API)}>API</Tag>
              </Paragraph>
              <div className="flex items-center gap-2">
                <Tag
                  color={getMethodColor(method)}
                  style={{ fontSize: 12, marginRight: 0 }}
                >
                  {method}
                </Tag>
                <Paragraph type="secondary" ellipsis style={{ margin: 0 }}>
                  {endpoint}
                </Paragraph>
              </div>
            </div>
            <div className="flex items-center">
              <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={onDelete}
              />
            </div>
          </div>
        </Tooltip>
      </Card>
    );
  }
}

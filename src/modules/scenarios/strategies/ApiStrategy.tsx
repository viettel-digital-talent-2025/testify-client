import { ApiConfigForm } from "@/scenarios/components/create/configs/simple";
import { getMethodColor } from "@/scenarios/utils";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Tag, Tooltip } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { ScenarioStrategy, StepCardProps } from ".";
import {
  ApiConfig,
  ApiConfigFormProps,
  BodyType,
  HttpMethod,
} from "../types/config";
import {
  CreateScenarioFlow,
  ScenarioFlowStepType,
  ScenarioStepForm,
  ScenarioType,
} from "../types/scenario";
import {
  getScenarioColorByStepType,
  getScenarioIconByStepType,
  getScenarioIconByType,
} from "../utils/scenarioUtils";

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
    if (config?.bodyType === BodyType.NONE) {
      payload = undefined;
    } else if (
      config?.bodyType === BodyType.FORM_DATA ||
      config?.bodyType === BodyType.URLENCODED
    ) {
      payload = Object.fromEntries(
        (config?.payload as Array<{ key: string; value: string }>)
          ?.filter((item) => item.key && item.value)
          .map(({ key, value }) => [key, value]),
      );
    } else {
      payload = ((config?.payload as string) || "").trim();
    }

    return {
      ...config,
      headers,
      payload,
    };
  }

  formatForm(config: ApiConfig): ApiConfigFormProps {
    const headers = Object.entries(config.headers || {}).map(
      ([key, value]) => ({
        key,
        value,
      }),
    );

    let payload: Array<{ key: string; value: string }> | string | undefined;
    if (config.bodyType === BodyType.NONE) {
      payload = undefined;
    } else if (
      config.bodyType === BodyType.FORM_DATA ||
      config.bodyType === BodyType.URLENCODED
    ) {
      payload = Object.entries(config.payload as Record<string, string>).map(
        ([key, value]) => ({
          key,
          value,
        }),
      );
    } else {
      payload = ((config.payload as string) || "").trim();
    }

    return {
      endpoint: config.endpoint,
      method: config.method,
      headers,
      bodyType: config.bodyType,
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
          order: index,
          steps: [
            {
              name: "API Step",
              description: "Load test an API",
              type: ScenarioFlowStepType.API,
              config: formattedConfig,
              order: index,
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
        order: index,
        steps: [
          {
            name: "API Step",
            description: "Load test an API",
            type: ScenarioFlowStepType.API,
            config: formattedConfig,
            order: index,
          },
        ],
      },
    ];
  }

  createMultiFlow(flows: CreateScenarioFlow[]): CreateScenarioFlow[] {
    return flows.map((flow, flowIndex) => ({
      ...flow,
      order: flowIndex,
      steps: flow.steps.map((step, stepIndex) => ({
        ...step,
        config: this.formatConfig(step.config as ApiConfigFormProps),
        order: stepIndex,
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
            {getScenarioIconByStepType({
              type: ScenarioFlowStepType.API,
            })}
            <div className="flex-1">
              <Paragraph ellipsis style={{ marginBottom: 8 }}>
                {name}
                <Tag
                  style={{ marginLeft: 8 }}
                  color={getScenarioColorByStepType(ScenarioFlowStepType.API)}
                >
                  {ScenarioFlowStepType.API}
                </Tag>
              </Paragraph>
              <div className="flex items-center gap-2">
                <Tag color={getMethodColor(method)} style={{ marginRight: 0 }}>
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

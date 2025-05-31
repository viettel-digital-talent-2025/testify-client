import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Tag, Tooltip } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { ScenarioStrategy, StepCardProps } from ".";
import { WebConfigForm } from "../components/create/configs/simple";
import { WebConfig, WebConfigFormProps } from "../types/config";
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

export class WebStrategy implements ScenarioStrategy {
  getType(): ScenarioType {
    return ScenarioType.WEB;
  }

  formatConfig(config: WebConfigFormProps): WebConfig {
    return {
      url: config.url,
    };
  }

  formatForm(config: WebConfig): WebConfigFormProps {
    return {
      url: config.url,
    };
  }

  createSimpleFlow(
    config: WebConfigFormProps = { url: "https://example.com" },
    index: number = 0,
  ): CreateScenarioFlow[] {
    if (index === 0) {
      return [
        {
          name: "Main Flow",
          description: "",
          weight: 100,
          order: index,
          steps: [
            {
              name: "Web Step",
              description: "Load test a web page",
              type: ScenarioFlowStepType.BROWSER,
              config,
              order: index,
            },
          ],
        },
      ];
    }

    return [
      {
        name: `Flow ${index + 1}`,
        description: `Web simple flow ${index + 1}`,
        weight: 100,
        order: index,
        steps: [
          {
            name: "Web Step",
            description: "Load test a web page",
            type: ScenarioFlowStepType.BROWSER,
            config,
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
        config: this.formatConfig(step.config as WebConfigFormProps),
        order: stepIndex,
      })),
    }));
  }

  createStep(
    config: WebConfigFormProps = { url: "https://example.com" },
    index?: number,
  ): ScenarioStepForm {
    return {
      name: `Web Step${index ? ` ${index + 1}` : ""}`,
      description: "Load test a web page",
      type: ScenarioFlowStepType.BROWSER,
      config,
    };
  }

  renderIcon(size: "small" | "medium" | "large") {
    return getScenarioIconByType({ type: ScenarioType.WEB, size });
  }

  renderForm(key?: string): React.ReactNode {
    return <WebConfigForm key={key} />;
  }

  renderStepCard(props: StepCardProps): React.ReactNode {
    const { name, config, onEdit, onDelete } = props;
    const { url } = config as WebConfigFormProps;

    return (
      <Card style={{ width: "100%" }}>
        <Tooltip>
          <div className="flex gap-2">
            {getScenarioIconByStepType({
              type: ScenarioFlowStepType.BROWSER,
            })}
            <div className="flex-1">
              <Paragraph ellipsis style={{ marginBottom: 8 }}>
                {name}
                <Tag
                  style={{ marginLeft: 8 }}
                  color={getScenarioColorByStepType(
                    ScenarioFlowStepType.BROWSER,
                  )}
                >
                  {ScenarioFlowStepType.BROWSER}
                </Tag>
              </Paragraph>
              <Paragraph type="secondary" ellipsis style={{ margin: 0 }}>
                {url}
              </Paragraph>
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

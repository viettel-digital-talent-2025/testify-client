import { Button, Card, Tag, Tooltip } from "antd";
import {
  CreateScenarioFlow,
  ScenarioType,
  ScenarioFlowStepType,
  ScenarioStepForm,
} from "../types/scenario";
import { ScenarioStrategy, StepCardProps } from ".";
import { WebConfig, WebConfigFormProps } from "../types/config";
import { WebConfigForm } from "../components/create/configs/simple";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  getScenarioColorByType,
  getScenarioIconByType,
} from "../components/utils/scenarioUtils";
import Paragraph from "antd/es/typography/Paragraph";

export class WebStrategy implements ScenarioStrategy {
  getType(): ScenarioType {
    return ScenarioType.WEB;
  }

  formatConfig(config: WebConfigFormProps): WebConfig {
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
          description: "Web simple flow",
          weight: 100,
          steps: [
            {
              name: "Web Step",
              description: "Load test a web page",
              type: ScenarioFlowStepType.BROWSER,
              config,
            },
          ],
        },
      ];
    }

    return [
      {
        name: `Flow ${index + 1}`,
        description: `Web simple flow ${index + 1}`,
        weight: 0,
        steps: [
          {
            name: "Web Step",
            description: "Load test a web page",
            type: ScenarioFlowStepType.BROWSER,
            config,
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
        config: this.formatConfig(step.config as WebConfigFormProps),
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
            {getScenarioIconByType({ type: ScenarioType.WEB })}
            <div className="flex-1">
              <Paragraph ellipsis style={{ marginBottom: 8 }}>
                {name}
                <Tag color={getScenarioColorByType(ScenarioType.WEB)}>WEB</Tag>
              </Paragraph>
              <Paragraph type="secondary" style={{ margin: 0 }}>
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

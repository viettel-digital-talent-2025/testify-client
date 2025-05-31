import { Card, Tag, Tooltip, Button } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {
  getMethodColor,
  getScenarioColorByStepType,
  getScenarioIconByStepType,
} from "../../utils";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ScenarioFlowStepType, ScenarioStep } from "@/scenarios/types/scenario";
import { ApiConfig, WebConfig } from "@/scenarios/types/config";

export interface StepCardProps {
  step: ScenarioStep;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ScenarioFlowStepCard(props: StepCardProps) {
  const { step, onEdit, onDelete } = props;

  return (
    <Card style={{ width: "100%" }}>
      <Tooltip>
        <div className="flex gap-2">
          {getScenarioIconByStepType({ type: step.type })}
          <div className="flex-1">
            <Paragraph ellipsis style={{ marginBottom: 8 }}>
              {step.name}
              <Tag
                color={getScenarioColorByStepType(step.type)}
                style={{ marginLeft: 8 }}
              >
                {step.type}
              </Tag>
            </Paragraph>
            <ScenarioFlowStepCardDescription {...step} />
          </div>
          <div className="flex items-center">
            {onEdit && (
              <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
            )}
            {onDelete && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={onDelete}
              />
            )}
          </div>
          
        </div>
      </Tooltip>
    </Card>
  );
}

function ScenarioFlowStepCardDescription(props: ScenarioStep) {
  const { type, config } = props;

  switch (type) {
    case ScenarioFlowStepType.BROWSER:
      const { url } = config as WebConfig;
      return (
        <div className="flex items-center gap-2">
          <Paragraph type="secondary" ellipsis style={{ margin: 0 }}>
            {url}
          </Paragraph>
        </div>
      );
    case ScenarioFlowStepType.API:
      const { method, endpoint } = config as ApiConfig;
      return (
        <div className="flex items-center gap-2">
          <Tag color={getMethodColor(method)} style={{ marginRight: 0 }}>
            {method}
          </Tag>
          <Paragraph type="secondary" ellipsis style={{ margin: 0 }}>
            {endpoint}
          </Paragraph>
        </div>
      );
    default:
      return null;
  }
}

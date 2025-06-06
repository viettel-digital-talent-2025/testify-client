import { ScenarioFlowType, ScenarioType } from "@/scenarios/types/scenario";
import { Space, Tag } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { getScenarioIconByType } from "../../../utils/scenarioUtils";

interface ScenarioCardHeaderProps {
  name: string;
  description?: string | null;
  type: ScenarioType;
  flowType: ScenarioFlowType;
}

export default function ScenarioCardHeader(props: ScenarioCardHeaderProps) {
  const { name, description, type, flowType } = props;
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {getScenarioIconByType({ type, size: "medium" })}
          <Title level={5} style={{ margin: 0 }} ellipsis>
            {name}
          </Title>
        </div>
        <Tag
          color={flowType === ScenarioFlowType.MULTI ? "gold" : "cyan"}
          style={{ marginRight: 0 }}
        >
          {flowType}
        </Tag>
      </div>
      <Paragraph type="secondary" ellipsis style={{ margin: 0 }}>
        {description || "No description"}
      </Paragraph>
    </Space>
  );
}

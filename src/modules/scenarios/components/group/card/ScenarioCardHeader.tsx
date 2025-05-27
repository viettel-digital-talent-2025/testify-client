import { Space } from "antd";
import { ScenarioType } from "@/scenarios/types/scenario";
import { getScenarioIconByType } from "../../utils/scenarioUtils";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

interface ScenarioCardHeaderProps {
  name: string;
  description: string;
  type: ScenarioType;
}

export default function ScenarioCardHeader(props: ScenarioCardHeaderProps) {
  const { name, description, type } = props;
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div className="flex gap-2">
        {getScenarioIconByType({ type, size: "medium" })}
        <Title level={4} style={{ margin: 0 }} ellipsis>
          {name}
        </Title>
      </div>
      <Paragraph type="secondary" ellipsis style={{ margin: 0 }}>
        {description}
      </Paragraph>
    </Space>
  );
}

import { Card, Space, Tag } from "antd";
import { ScenarioFlow } from "@/scenarios/types/scenario";
import { OrderedListOutlined } from "@ant-design/icons";
import Text from "antd/es/typography/Text";

interface ScenarioCardFlowProps {
  flows: ScenarioFlow[];
}

export default function ScenarioCardFlow({ flows }: ScenarioCardFlowProps) {
  return (
    <Card
      style={{ width: "100%", padding: 0 }}
      styles={{
        header: { padding: 16 },
        body: { padding: 16 },
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {flows.map((flow) => (
          <div className="flex justify-between" key={flow.id}>
            <Text>{flow.name}</Text>
            <div>
              <Tag>
                {flow.steps.length} <OrderedListOutlined />
              </Tag>
              <Tag style={{ marginRight: 0 }}>{flow.weight}%</Tag>
            </div>
          </div>
        ))}
      </Space>
    </Card>
  );
}

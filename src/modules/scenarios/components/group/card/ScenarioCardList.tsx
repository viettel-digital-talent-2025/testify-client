import { ScenarioFlow } from "@/scenarios/types/scenario";
import { Card, Space, Tag } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";

interface ScenarioCardListProps {
  flows: ScenarioFlow[];
}

export default function ScenarioCardList({ flows }: ScenarioCardListProps) {
  return (
    <Card className="mt-4 bg-gray-50">
      <Title level={5} className="mb-2">
        Flows
      </Title>
      <Space direction="vertical" className="w-full">
        {flows.map((flow, index) => {
          const flowName = flow?.name || `Flow ${index + 1}`;
          const flowWeight = flow?.weight || 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-md bg-white p-2"
            >
              <Space>
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: flowWeight > 50 ? "#8884d8" : "#d1d5db",
                  }}
                />
                <Text>{flowName}</Text>
              </Space>
              <Tag>{flowWeight}%</Tag>
            </div>
          );
        })}

        {flows.length === 0 && (
          <div className="rounded-md bg-white p-2 text-center text-gray-500">
            No flows defined
          </div>
        )}
      </Space>
    </Card>
  );
}

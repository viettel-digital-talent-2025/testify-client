import LoadTestButton from "@/scenarios/components/common/LoadTestButton";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Space } from "antd";
import Text from "antd/es/typography/Text";

interface ScenarioCardFooterProps {
  scenarioId: string;
  lastRun: string | null;
  showLoadTestButton?: boolean;
}

export default function ScenarioCardFooter({
  scenarioId,
  lastRun,
  showLoadTestButton = true,
}: ScenarioCardFooterProps) {
  return (
    <div className="flex items-center justify-between">
      <Space>
        <ClockCircleOutlined />
        <Text type="secondary">Last run: {formatDate(lastRun)}</Text>
      </Space>
      {showLoadTestButton && (
        <Space>
          <LoadTestButton scenarioId={scenarioId} />
        </Space>
      )}
    </div>
  );
}

const formatDate = (date: string | null) => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("vn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

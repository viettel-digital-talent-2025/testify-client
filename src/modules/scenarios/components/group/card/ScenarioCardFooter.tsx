import LoadTestButton from "@/scenarios/components/common/LoadTestButton";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import { formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";

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
        <Tooltip title={dayjs(lastRun).format("YYYY-MM-DD HH:mm:ss")}>
          <Text type="secondary">
            Last run:{" "}
            {lastRun ? formatDistanceToNow(new Date(lastRun)) : "Never"}
          </Text>
        </Tooltip>
      </Space>
      {showLoadTestButton && (
        <Space>
          <LoadTestButton scenarioId={scenarioId} />
        </Space>
      )}
    </div>
  );
}

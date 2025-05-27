import { Space, Button } from "antd";
import {
  ClockCircleOutlined,
  PlayCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Text from "antd/es/typography/Text";

interface ScenarioCardFooterProps {
  lastRun: string | null;
  isRunning: boolean;
  onRun: () => void;
  isCanceling: boolean;
  onCancel: () => void;
}

export default function ScenarioCardFooter({
  lastRun,
  isRunning,
  onRun,
  isCanceling,
  onCancel,
}: ScenarioCardFooterProps) {
  return (
    <div className="flex items-center justify-between">
      <Space>
        <ClockCircleOutlined />
        <Text type="secondary">Last run: {formatDate(lastRun)}</Text>
      </Space>
      <Space>
        {/* <Button
          danger
          icon={<CloseOutlined />}
          loading={isCanceling}
          onClick={onCancel}
        >
          Stop
        </Button> */}
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          loading={isRunning}
          onClick={onRun}
        >
          Run
        </Button>
      </Space>
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

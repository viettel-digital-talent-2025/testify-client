import { Space } from "antd";
import { ScenarioFlow, ScenarioFlowType } from "@/scenarios/types/scenario";
import { getScenarioStatsIcon } from "@/scenarios/components/utils/scenarioUtils";
import Text from "antd/es/typography/Text";

interface ScenarioCardStatsProps {
  flows: ScenarioFlow[];
  flowType: ScenarioFlowType;
  virtualUsers: number | string;
  duration: number;
  lastRun: string | null;
}

export default function ScenarioCardStats({
  flows,
  flowType,
  virtualUsers,
  duration,
}: ScenarioCardStatsProps) {
  const totalSteps = flows.reduce((sum, flow) => {
    return sum + (flow?.steps?.length || 0);
  }, 0);

  const flowCount = flows.length;

  return (
    <div className="flex justify-between text-sm">
      {flowType === ScenarioFlowType.MULTI && (
        <>
          <Space direction="vertical" size={0}>
            <Text type="secondary">{getScenarioStatsIcon("flows")} Flows</Text>
            <Text strong>{flowCount}</Text>
          </Space>
        </>
      )}
      <Space direction="vertical" size={0}>
        <Text type="secondary">{getScenarioStatsIcon("steps")} Steps</Text>
        <Text strong>{totalSteps}</Text>
      </Space>
      <Space direction="vertical" size={0}>
        <Text type="secondary">{getScenarioStatsIcon("vus")} VUs</Text>
        <Text strong>{virtualUsers}</Text>
      </Space>
      <Space direction="vertical" size={0}>
        <Text type="secondary">
          {getScenarioStatsIcon("duration")} Duration
        </Text>
        <Text strong>{formatDuration(duration)}</Text>
      </Space>
    </div>
  );
}

function formatDuration(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  let result = "";
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m`;
  }
  return result;
}

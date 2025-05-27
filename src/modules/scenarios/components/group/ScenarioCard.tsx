"use client";
import { useRouter } from "next/navigation";
import { Card, Space } from "antd";
import { Scenario, ScenarioFlowType } from "@/scenarios/types/scenario";
import {
  useRunLoadTestMutation,
  useStopLoadTestMutation,
} from "@/scenarios/apis/loadTestApi";
import {
  ScenarioCardHeader,
  ScenarioCardStats,
  ScenarioCardFlow,
  ScenarioCardFooter,
} from "./card";
import { useAppDispatch } from "@/shared/hooks";
import { setSelectedScenarioId } from "@/scenarios/slices/scenariosSlice";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

interface ScenarioCardProps {
  scenario: Scenario;
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const flows = scenario.flows || [];

  const [runScenario, { isLoading: isRunning }] = useRunLoadTestMutation();
  const [stopScenario, { isLoading: isCanceling }] = useStopLoadTestMutation();

  const onClick = () => {
    dispatch(setSelectedScenarioId(scenario.id));
    router.push(`/scenarios/${scenario.id}`);
  };

  const onRun = async () => {
    await runScenario(scenario.id);
  };

  const onCancel = async () => {
    await stopScenario(scenario.id);
  };

  return (
    <Card hoverable onClick={onClick}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Header */}
        <ScenarioCardHeader
          name={scenario.name}
          description={scenario.description || "No description"}
          type={scenario.type}
        />

        {/* Stats */}
        <ScenarioCardStats
          flows={flows}
          flowType={scenario.flowType}
          virtualUsers={scenario.vus}
          duration={scenario.duration}
          lastRun={scenario.lastRun}
        />

        {/* Flows */}
        {scenario.flowType === ScenarioFlowType.MULTI && (
          <ScenarioCardFlow flows={flows} />
        )}

        {/* Footer */}
        <ScenarioCardFooter
          lastRun={scenario.lastRun}
          isRunning={isRunning}
          onRun={onRun}
          isCanceling={isCanceling}
          onCancel={onCancel}
        />
      </Space>
    </Card>
  );
}

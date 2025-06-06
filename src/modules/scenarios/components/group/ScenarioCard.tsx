"use client";
import { setSelectedScenarioId } from "@/scenarios/slices/scenariosSlice";
import { Scenario } from "@/scenarios/types/scenario";
import { useAppDispatch } from "@/shared/hooks";
import { Card, Space } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  ScenarioCardFooter,
  ScenarioCardHeader,
  ScenarioCardStats,
} from "./card";
dayjs.extend(relativeTime);

interface ScenarioCardProps {
  scenario: Scenario;
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const flows = scenario.flows || [];

  const onClick = useCallback(() => {
    dispatch(setSelectedScenarioId(scenario.id));
    router.push(`/scenarios/${scenario.id}`);
  }, [dispatch, router, scenario.id]);

  return (
    <Card hoverable onClick={onClick}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Header */}
        <ScenarioCardHeader
          name={scenario.name}
          description={scenario.description}
          type={scenario.type}
          flowType={scenario.flowType}
        />

        {/* Stats */}
        <ScenarioCardStats
          flows={flows}
          virtualUsers={scenario.vus}
          duration={scenario.duration}
        />

        {/* Footer */}
        <ScenarioCardFooter
          scenarioId={scenario.id}
          lastRun={scenario.runHistories[0]?.runAt}
        />
      </Space>
    </Card>
  );
}

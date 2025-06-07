import {
  ScenarioCardFooter,
  ScenarioCardHeader,
  ScenarioCardStats,
} from "@/scenarios/components/group/card";
import { Scenario } from "@/scenarios/types/scenario";
import { Card, Space } from "antd";

export default function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }}>
        <ScenarioCardHeader
          name={scenario.name}
          description={scenario.description || ""}
          type={scenario.type}
          flowType={scenario.flowType}
        />

        <ScenarioCardStats
          flows={scenario.flows}
          virtualUsers={scenario.vus}
          duration={scenario.duration}
        />

        <ScenarioCardFooter
          scenarioId={scenario.id}
          lastRun={scenario.runHistories[0]?.runAt}
          showLoadTestButton={false}
        />
      </Space>
    </Card>
  );
}

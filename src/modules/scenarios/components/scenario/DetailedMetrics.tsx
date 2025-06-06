"use client";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import { selectIsRunningJobByScenarioId } from "@/scenarios/slices/metricsSlice";
import {
  selectSelectedScenarioId,
  selectSelectedSteps,
} from "@/scenarios/slices/scenariosSlice";
import { useAppSelector } from "@/shared/hooks";
import { Space } from "antd";

export default function DetailedMetrics() {
  const id = useAppSelector(selectSelectedScenarioId);
  const selectedSteps = useAppSelector(selectSelectedSteps);
  const isRunning = useAppSelector((state) =>
    selectIsRunningJobByScenarioId(state, id),
  );

  return (
    <>
      {selectedSteps.length > 0 && (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {selectedSteps.map((step) => (
            <div key={`${step.flowId}-${step.stepId}`}>
              <RealtimeMetricsChart
                isRunning={isRunning}
                scenarioId={id}
                flowId={step.flowId}
                stepId={step.stepId}
                title={`${step.flowName} ${step.stepName ? `- ${step.stepName}` : ""}`}
                showLastUpdated={false}
                showProgress={false}
              />
            </div>
          ))}
        </Space>
      )}
    </>
  );
}

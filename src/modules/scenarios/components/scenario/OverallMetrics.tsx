"use client";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import { selectIsRunningJobByScenarioId } from "@/scenarios/slices/metricsSlice";
import { selectSelectedScenarioId } from "@/scenarios/slices/scenariosSlice";
import { useAppSelector } from "@/shared/hooks";

export default function OverallMetrics() {
  const scenarioId = useAppSelector(selectSelectedScenarioId);
  const isRunning = useAppSelector((state) =>
    selectIsRunningJobByScenarioId(state, scenarioId),
  );

  return (
    <div className="flex flex-col gap-2">
      <RealtimeMetricsChart
        isRunning={isRunning}
        scenarioId={scenarioId}
        showFilter={true}
      />
    </div>
  );
}

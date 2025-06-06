"use client";
import { selectSelectedRunHistory } from "@/dashboard/slices/dashboardSlice";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import { selectIsRunningJobByRunHistoryId } from "@/scenarios/slices/metricsSlice";
import { useAppSelector } from "@/shared/hooks";

export default function MetricsCard() {
  const runHistory = useAppSelector(selectSelectedRunHistory);
  const isRunning = useAppSelector((state) =>
    selectIsRunningJobByRunHistoryId(state, runHistory?.runHistoryId),
  );

  return (
    <RealtimeMetricsChart
      isRunning={isRunning}
      scenarioId={runHistory?.scenarioId}
      runHistoryId={runHistory?.runHistoryId}
      showScenarioName={true}
      showViewDetails={true}
      showProgress={false}
    />
  );
}

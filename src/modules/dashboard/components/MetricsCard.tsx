"use client";
import { selectSelectedRunHistory } from "@/dashboard/slices/dashboardSlice";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import { useAppSelector } from "@/shared/hooks";

export default function MetricsCard() {
  const runHistory = useAppSelector(selectSelectedRunHistory);
  return (
    <RealtimeMetricsChart
      id={runHistory?.scenarioId}
      runHistoryId={runHistory?.runHistoryId}
      showScenarioName={true}
      showViewDetails={true}
    />
  );
}

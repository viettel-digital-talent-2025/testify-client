"use client";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import { selectSelectedScenarioId } from "@/scenarios/slices/scenariosSlice";
import { useAppSelector } from "@/shared/hooks";

export default function OverallMetrics() {
  const id = useAppSelector(selectSelectedScenarioId);

  return (
    <div className="flex flex-col gap-2">
      <RealtimeMetricsChart id={id} showFilter={true} />
    </div>
  );
}

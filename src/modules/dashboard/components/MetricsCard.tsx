"use client";
import { BottleneckSeverity } from "@/bottlenecks/types/bottleneck";
import { selectSelectedRunHistory } from "@/dashboard/slices/dashboardSlice";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import { selectIsRunningJobByRunHistoryId } from "@/scenarios/slices/metricsSlice";
import {
  setSelectedSeverity,
  setSelectedSteps,
} from "@/scenarios/slices/scenariosSlice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";

export default function MetricsCard() {
  const dispatch = useAppDispatch();
  const runHistory = useAppSelector(selectSelectedRunHistory);
  const isRunning = useAppSelector((state) =>
    selectIsRunningJobByRunHistoryId(state, runHistory?.runHistoryId),
  );

  useEffect(() => {
    dispatch(setSelectedSteps([]));
    dispatch(setSelectedSeverity([BottleneckSeverity.HIGH]));
  }, [dispatch, runHistory?.scenarioId]);

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

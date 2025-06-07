"use client";
import { useGetBottlenecksByRunHistoryIdQuery } from "@/bottlenecks/apis/bottlenecksApi";
import { selectSelectedRunHistoryId } from "@/bottlenecks/slices/bottlenecksSlice";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import {
  selectSelectedSteps,
  setSelectedScenario,
} from "@/scenarios/slices/scenariosSlice";
import { PageTitle } from "@/shared/components/pages";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Tabs } from "antd";
import Card from "antd/es/card/Card";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import "./BottleneckDetails.css";
import { BottleneckDetailsView } from "./details";

export default function BottleneckDetails() {
  const dispatch = useAppDispatch();
  const selectedRunHistoryId = useSelector(selectSelectedRunHistoryId);
  const selectedSteps = useAppSelector(selectSelectedSteps);
  const { data: runHistory, isLoading } = useGetBottlenecksByRunHistoryIdQuery(
    { runHistoryId: selectedRunHistoryId || "" },
    { skip: !selectedRunHistoryId },
  );

  const allBottlenecks = useMemo(() => {
    if (!runHistory?.scenario?.flows) return [];

    return runHistory.scenario.flows.flatMap((flow) =>
      flow.steps.flatMap((step) => step.bottlenecks),
    );
  }, [runHistory]);

  useEffect(() => {
    if (!runHistory) return;
    dispatch(setSelectedScenario(runHistory?.scenario));
  }, [dispatch, runHistory]);

  const items = useMemo(() => {
    if (!runHistory || !allBottlenecks) {
      return [];
    }

    return [
      {
        key: "details",
        label: "Details",
        children: <BottleneckDetailsView runHistory={runHistory} />,
      },
      {
        key: "metrics",
        label: "Metrics",
        children: (
          <>
            <RealtimeMetricsChart
              isRunning={false}
              scenarioId={runHistory.scenario.id}
              runHistoryId={runHistory.id}
              showFilter={true}
              showSeverity={true}
              bottlenecks={allBottlenecks}
              title="Performance Metrics with Bottlenecks"
              style={{
                flex: 1,
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            />
            <div className="">
              {selectedSteps.map((step) => (
                <div key={`${step.flowId}-${step.stepId}`}>
                  <RealtimeMetricsChart
                    isRunning={false}
                    scenarioId={runHistory.scenario.id}
                    runHistoryId={runHistory.id}
                    flowId={step.flowId}
                    stepId={step.stepId}
                    title={`${step.flowName} ${step.stepName ? `- ${step.stepName}` : ""}`}
                    showLastUpdated={false}
                    showProgress={false}
                    bottlenecks={allBottlenecks.filter(
                      (bottleneck) => bottleneck.stepId === step.stepId,
                    )}
                  />
                </div>
              ))}
            </div>
          </>
        ),
      },
    ];
  }, [runHistory, allBottlenecks, selectedSteps]);

  if (isLoading || !runHistory) {
    return <Card loading={isLoading} />;
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <PageTitle
        title="Bottleneck Detection"
        description="AI-powered detection and analysis of performance bottlenecks in your test scenarios."
      />
      <Tabs
        items={items}
        style={{
          flex: 1,
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      />
    </div>
  );
}

"use client";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import {
  selectSelectedScenario,
  selectSelectedSteps,
  setSelectedSteps,
} from "@/scenarios/slices/scenariosSlice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Card, Select, Space, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { useCallback, useMemo } from "react";

export default function OverallMetrics() {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <RealtimeMetricsHeader />
        <RealtimeMetricsChart />
      </div>
    </Card>
  );
}

function RealtimeMetricsHeader() {
  const dispatch = useAppDispatch();
  const scenario = useAppSelector(selectSelectedScenario);
  const selectedSteps = useAppSelector(selectSelectedSteps);

  const options = useMemo(() => {
    const allSteps =
      scenario?.flows
        .map((flow) => {
          return [
            {
              label: `${flow.name} - All Steps`,
              value: `${flow.id}:`,
              flowId: flow.id,
              stepId: null,
              flowName: flow.name,
              stepName: null,
            },
            ...flow.steps.map((step) => ({
              label: `${flow.name} - ${step.name}`,
              value: `${flow.id}:${step.id}`,
              flowId: flow.id,
              stepId: step.id,
              flowName: flow.name,
              stepName: step.name,
            })),
          ];
        })
        .flat() || [];

    return allSteps;
  }, [scenario]);

  const handleStepSelect = useCallback(
    (values: string[]) => {
      const newSelectedSteps = values.map((value) => {
        const [flowId, stepId] = value.split(":");
        const option = options.find((opt) => opt.value === value);
        return {
          flowId,
          stepId,
          flowName: option?.flowName || "",
          stepName: option?.stepName || "",
        };
      });
      dispatch(setSelectedSteps(newSelectedSteps));
    },
    [dispatch, options],
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center justify-between">
        <Space style={{ width: "100%" }}>
          <Title level={4} style={{ margin: 0 }}>
            Overall Metrics
          </Title>
          <Tag color="processing">Live</Tag>
        </Space>
      </div>
      <Select
        allowClear
        mode="multiple"
        placeholder="Select steps to compare metrics"
        onChange={handleStepSelect}
        options={options}
        value={selectedSteps.map((step) => `${step.flowId}:${step.stepId}`)}
        maxTagCount={1}
        disabled={!scenario?.flows.length}
        style={{ width: "300px" }}
      />
    </div>
  );
}

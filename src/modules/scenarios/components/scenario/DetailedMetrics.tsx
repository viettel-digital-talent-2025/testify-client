"use client";
import { RealtimeMetricsChart } from "@/scenarios/components/scenario/metrics/RealtimeMetricsChart";
import { selectSelectedSteps } from "@/scenarios/slices/scenariosSlice";
import { useAppSelector } from "@/shared/hooks";
import { Card, Space } from "antd";
import Title from "antd/es/typography/Title";

export default function DetailedMetrics() {
  const selectedSteps = useAppSelector(selectSelectedSteps);

  return (
    <>
      {selectedSteps.length > 0 && (
        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {selectedSteps.map((step) => (
              <div key={`${step.flowId}-${step.stepId}`}>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {step.flowName}
                  {step.stepName && ` - ${step.stepName}`}
                </Title>
                <RealtimeMetricsChart
                  flowId={step.flowId}
                  stepId={step.stepId}
                  showLastUpdated={false}
                  showProgress={false}
                />
              </div>
            ))}
          </Space>
        </Card>
      )}
    </>
  );
}

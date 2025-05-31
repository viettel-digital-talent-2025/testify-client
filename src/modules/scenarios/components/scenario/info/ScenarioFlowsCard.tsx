"use client";
import { ScenarioFlowStepCard } from "@/scenarios/components/common";
import { Scenario } from "@/scenarios/types/scenario";
import { Card, Space, Tabs, Tag } from "antd";
import Paragraph from "antd/es/typography/Paragraph";

export default function ScenarioFlowsCard({
  scenario,
}: {
  scenario: Scenario;
}) {
  return (
    <Card>
      <Tabs
        size="small"
        items={scenario.flows.map((flow) => ({
          key: flow.id,
          label: (
            <Space>
              <Paragraph ellipsis style={{ marginBottom: 0 }}>
                {flow.name}
              </Paragraph>
              <Tag color="purple">{flow.weight.toFixed(0)}%</Tag>
            </Space>
          ),
          children: (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {flow.description && (
                <Paragraph
                  ellipsis
                  type="secondary"
                  style={{ marginBottom: 0 }}
                >
                  {flow.description}
                </Paragraph>
              )}
              {flow.steps.map((step) => (
                <ScenarioFlowStepCard key={step.id} step={step} />
              ))}
            </Space>
          ),
        }))}
      />
    </Card>
  );
}

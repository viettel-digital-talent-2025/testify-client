"use client";
import { Card } from "antd";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import Title from "antd/es/typography/Title";

export default function ScenarioSimpleCard() {
  const { strategy } = useScenarioFormContext();
  return (
    <Card>
      <Title level={4}>Simple Scenario Configuration</Title>
      {strategy.renderForm()}
    </Card>
  );
}

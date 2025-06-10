"use client";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { Form } from "antd";
import { ScenarioMultiFlowCard } from "./configs";

export default function ScenarioConfigCard() {
  const { form } = useScenarioFormContext();
  return (
    <Form form={form} layout="vertical">
      <ScenarioMultiFlowCard />
    </Form>
  );
}

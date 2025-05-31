"use client";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { ScenarioFlowType } from "@/scenarios/types/scenario";
import { Form } from "antd";
import { ScenarioMultiFlowCard, ScenarioSimpleCard } from "./configs";

export default function ScenarioConfigCard() {
  const { form } = useScenarioFormContext();
  const flow = Form.useWatch("flowType", form);
  return (
    <Form form={form} layout="vertical">
      {renderFlowComponent(flow)}
    </Form>
  );
}

const renderFlowComponent = (flow: ScenarioFlowType) => {
  switch (flow) {
    case ScenarioFlowType.SIMPLE:
      return <ScenarioSimpleCard />;
    case ScenarioFlowType.MULTI:
      return <ScenarioMultiFlowCard />;
    default:
      return null;
  }
};

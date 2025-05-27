"use client";
import { Form } from "antd";
import { ScenarioSimpleCard, ScenarioMultiFlowCard } from "./configs";
import { ScenarioFlowType } from "@/scenarios/types/scenario";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";

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

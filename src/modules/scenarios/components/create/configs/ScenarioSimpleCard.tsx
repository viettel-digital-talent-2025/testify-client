"use client";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { Card, Form } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect } from "react";
import { FlowStepsInput } from "./multi/FlowInput";

export default function ScenarioSimpleCard() {
  const { form, strategy, isEditing } = useScenarioFormContext();
  const type = Form.useWatch("type", form);

  useEffect(() => {
    const createFirstFlow = () => {
      const flows = form.getFieldValue(["flows"]);
      if (!flows) {
        form.setFieldsValue({
          flows: strategy.createSimpleFlow(),
        });
      }
    };
    if (!isEditing) {
      createFirstFlow();
    }
  }, [form, strategy, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      form.setFieldsValue({
        flows: strategy.createSimpleFlow(),
      });
    }
  }, [form, strategy, type, isEditing]);

  return (
    <Card>
      <Title level={4}>Simple Scenario Configuration</Title>

      <Form.List name="flows">
        {(fields) => {
          return <FlowContent key={fields[0]?.key} flowName={0} />;
        }}
      </Form.List>
    </Card>
  );
}

export function FlowContent({ flowName }: { flowName: number }) {
  return <FlowStepsInput flowName={flowName} />;
}

"use client";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { Card, Form, Space, Tabs, Tag } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { useCallback, useEffect, useState } from "react";
import { FlowContent, StepModal } from "./multi";

export default function ScenarioMultiFlowCard() {
  const { form, strategy, isEditing } = useScenarioFormContext();
  const type = Form.useWatch("type", form);
  const flows = Form.useWatch("flows", form);
  const [activeFlow, setActiveFlow] = useState<string>("0");

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

  const redistributeWeights = useCallback(
    (
      flows: Array<{
        name: string;
        description: string;
        weight: number;
        steps: Record<string, unknown>[];
      }>,
    ) => {
      const equalWeight = 100 / flows.length;
      return flows.map((f) => ({ ...f, weight: equalWeight }));
    },
    [],
  );

  return (
    <Card>
      <Title level={4}>Multi-Flow Scenario Configuration</Title>

      <Form.List name="flows">
        {(fields, { remove }) => {
          const active = activeFlow || fields[0]?.key?.toString();

          const items = fields.map(({ key, name }) => {
            const flow = flows?.[name];
            return {
              key: key.toString(),
              label: (
                <Space>
                  <Paragraph ellipsis style={{ marginBottom: 0 }}>
                    {flow?.name}
                  </Paragraph>
                  <Tag color="purple">{flow?.weight.toFixed(0)}%</Tag>
                </Space>
              ),
              children: <FlowContent key={key} flowName={name} />,
            };
          });

          const handleEdit = (
            e: React.MouseEvent | React.KeyboardEvent | string,
            action: "add" | "remove",
          ) => {
            if (action === "add") {
              const currentFlows = [...form.getFieldValue("flows")];
              const newFlow = strategy.createSimpleFlow(
                undefined,
                currentFlows.length,
              )[0];
              const updatedFlows = [...currentFlows, newFlow];

              const redistributed = redistributeWeights(updatedFlows);
              form.setFieldsValue({ flows: redistributed });
              setActiveFlow((updatedFlows.length - 1).toString());
            }

            if (action === "remove" && typeof e === "string") {
              if (fields.length === 1) {
                const updatedFlows = form.getFieldValue("flows");
                updatedFlows[0].weight = 100;
                form.setFieldsValue({ flows: updatedFlows });
                return;
              }
              const index = fields.findIndex((f) => f.key.toString() === e);
              if (index !== -1) {
                remove(index);
                const remaining = fields.filter((_, i) => i !== index);
                setActiveFlow(remaining[0]?.key?.toString() || "0");
              }
            }
          };

          return (
            <Tabs
              size="small"
              type="editable-card"
              activeKey={active}
              onChange={(key) => setActiveFlow(key)}
              onEdit={handleEdit}
              items={items}
            />
          );
        }}
      </Form.List>

      <StepModal />
    </Card>
  );
}

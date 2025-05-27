"use client";
import { useMemo, useCallback } from "react";
import { Input, Slider, Form, InputNumber, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { ScenarioFlow } from "@/scenarios/types/scenario";

export function FlowNameInput({ flowName }: { flowName: number }) {
  return (
    <Form.Item
      label="Flow Name"
      name={[flowName, "name"]}
      rules={[
        {
          required: true,
          message: "Please enter flow name",
        },
      ]}
    >
      <Input placeholder="Enter flow name" />
    </Form.Item>
  );
}

export function FlowDescriptionInput({ flowName }: { flowName: number }) {
  return (
    <Form.Item label="Flow Description" name={[flowName, "description"]}>
      <Input allowClear placeholder="Enter flow description" />
    </Form.Item>
  );
}

export function FlowWeightInput({ flowName }: { flowName: number }) {
  const { form, lockedIndexes, setLockedIndexes } = useScenarioFormContext();

  const adjustWeights = (
    flows: ScenarioFlow[],
    editedIndex: number,
    newWeight: number,
  ) => {
    const minWeight = 1;
    const totalFlows = flows.length;

    if (totalFlows === 1) return [{ ...flows[0], weight: 100 }];

    // Cập nhật lockedIndexes, duy trì kích thước queue FIFO
    const newLocked = [...lockedIndexes];
    if (!newLocked.includes(editedIndex)) {
      newLocked.push(editedIndex);
      if (newLocked.length > totalFlows) {
        newLocked.shift();
      }
    }

    // Tính danh sách các chỉ số chưa bị lock và không phải editedIndex
    const unlockedIndexes = [];
    let lockedTotal = 0;
    for (let i = 0; i < totalFlows; i++) {
      if (i === editedIndex) continue;
      if (newLocked.includes(i)) {
        lockedTotal += flows[i].weight;
      } else {
        unlockedIndexes.push(i);
      }
    }

    // Nếu không còn unlocked nào thì giữ nguyên flows
    if (unlockedIndexes.length === 0) {
      setLockedIndexes(newLocked);
      return flows;
    }

    // Tổng weight ban đầu của unlocked flows
    const totalUnlockedOriginal = unlockedIndexes.reduce(
      (sum, i) => sum + flows[i].weight,
      0,
    );

    const remainingWeight = Math.max(0, 100 - newWeight - lockedTotal);

    // Tạo mảng mới với weight được điều chỉnh
    const updatedFlows = flows.map((flow, i) => {
      if (i === editedIndex) return { ...flow, weight: newWeight };

      if (newLocked.includes(i)) return flow;

      const proportion =
        totalUnlockedOriginal === 0
          ? 1 / unlockedIndexes.length
          : flow.weight / totalUnlockedOriginal;
      const newW = Math.max(minWeight, proportion * remainingWeight);
      return { ...flow, weight: newW };
    });

    // Chuẩn hóa tổng về 100%
    const totalWeight = updatedFlows.reduce((sum, f) => sum + f.weight, 0);
    const scale = 100 / totalWeight;

    const normalized = updatedFlows.map((f) => ({
      ...f,
      weight: Math.round(f.weight * scale * 100) / 100,
    }));

    setLockedIndexes(newLocked);
    return normalized;
  };

  const onWeightChange = (val: number) => {
    const flows = form.getFieldValue("flows");
    const updated = adjustWeights(flows, flowName, val);
    form.setFieldsValue({ flows: updated });
  };

  const getWeight = () =>
    form.getFieldValue(["flows", flowName, "weight"]) ?? 1;

  return (
    <Form.Item
      label="Flow Weight"
      extra="Percentage of virtual users that will follow this flow"
    >
      <div className="flex items-center gap-2">
        <Form.Item name={[flowName, "weight"]} style={{ margin: 0 }}>
          <InputNumber
            min={1}
            max={100}
            value={getWeight()}
            onChange={(val) => onWeightChange(val as number)}
          />
        </Form.Item>
        <Form.Item
          name={[flowName, "weight"]}
          style={{ margin: 0, width: "100%" }}
        >
          <Slider
            min={1}
            max={100}
            onChange={(val) => onWeightChange(val as number)}
            value={getWeight()}
            tooltip={{ open: false }}
          />
        </Form.Item>
      </div>
    </Form.Item>
  );
}

export function FlowStepsInput({ flowName }: { flowName: number }) {
  const { form, strategy, handleEditStep } = useScenarioFormContext();
  const stepPath = useMemo(() => ["flows", flowName, "steps"], [flowName]);

  const addStep = useCallback(() => {
    const currentSteps = form.getFieldValue(stepPath) || [];
    const newStep = strategy.createStep(undefined, currentSteps.length);

    form.setFieldValue(stepPath, [...currentSteps, newStep]);
  }, [form, stepPath, strategy]);

  return (
    <Form.Item
      label="Steps"
      name={[flowName, "steps"]}
      rules={[
        {
          required: true,
          message: "Please add at least one step",
        },
      ]}
    >
      <Form.List name={[flowName, "steps"]}>
        {(fields, { remove }) => {
          const stepValues = form.getFieldValue(stepPath) || [];
          return (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const step = stepValues[name] || {};
                return (
                  <Form.Item
                    {...restField}
                    key={key}
                    name={[name, "type"]}
                    style={{ flex: 1, marginBottom: 8 }}
                  >
                    {strategy.renderStepCard({
                      name: step.name,
                      config: step.config,
                      onEdit: () => handleEditStep({ flowName, name }),
                      onDelete: () => remove(name),
                    })}
                  </Form.Item>
                );
              })}

              <Form.Item style={{ marginBottom: 8 }}>
                <Button type="dashed" onClick={addStep} icon={<PlusOutlined />}>
                  Add Step
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    </Form.Item>
  );
}

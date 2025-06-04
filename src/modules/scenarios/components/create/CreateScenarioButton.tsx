"use client";
import { useCreateScenarioMutation } from "@/scenarios/apis/scenarioApi";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { getScenarioStrategy } from "@/scenarios/strategies";
import { useNotification } from "@/shared/hooks";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function CreateScenarioButton() {
  const router = useRouter();
  const { form } = useScenarioFormContext();
  const { notify } = useNotification();
  const [createScenario, { isLoading }] = useCreateScenarioMutation();

  const onFinish = useCallback(async () => {
    await form.validateFields();
    if (form.getFieldsError().some((field) => field.errors.length > 0)) {
      return;
    }

    const { name, description, vus, duration, type, flowType, groupId, flows } =
      form.getFieldsValue();

    const durationInSeconds =
      duration.hour() * 3600 + duration.minute() * 60 + duration.second();

    const strategy = getScenarioStrategy(type);

    const formattedFlows = strategy.createMultiFlow(flows);

    const scenario = {
      name,
      description,
      type,
      flowType,
      vus,
      groupId: groupId === "null" ? null : groupId,
      duration: durationInSeconds,
      flows: formattedFlows,
    };

    const res = await createScenario(scenario);

    if (!res.error) {
      router.push(`/scenarios`);
    } else {
      notify({
        message: "Failed to create scenario",
        description: "Please try again",
        notiType: "error",
      });
    }
  }, [createScenario, form, router, notify]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      onClick={onFinish}
      loading={isLoading}
      icon={<PlusOutlined />}
    >
      Create
    </Button>
  );
}

"use client";
import { useUpdateScenarioMutation } from "@/scenarios/apis/scenarioApi";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { getScenarioStrategy } from "@/scenarios/strategies";
import { ScenarioFlowType } from "@/scenarios/types/scenario";
import { useNotification } from "@/shared/hooks";
import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function UpdateScenarioButton({ id }: { id: string }) {
  const router = useRouter();
  const { form } = useScenarioFormContext();
  const { notify } = useNotification();
  const [updateScenario, { isLoading }] = useUpdateScenarioMutation();

  const onFinish = useCallback(async () => {
    await form.validateFields();
    if (form.getFieldsError().some((field) => field.errors.length > 0)) {
      return;
    }

    const {
      name,
      description,
      vus,
      duration,
      type,
      flowType,
      groupId,
      config,
      flows,
    } = form.getFieldsValue();

    const durationInSeconds =
      duration.hour() * 3600 + duration.minute() * 60 + duration.second();

    const strategy = getScenarioStrategy(type);
    let formattedFlows = [];
    if (flowType === ScenarioFlowType.SIMPLE) {
      formattedFlows = strategy.createSimpleFlow(config);
    } else {
      formattedFlows = strategy.createMultiFlow(flows);
    }

    const scenario = {
      id,
      name,
      description,
      type,
      flowType,
      vus,
      groupId,
      duration: durationInSeconds,
      flows: formattedFlows,
    };

    const res = await updateScenario(scenario);

    if (!res.error) {
      router.push(`/scenarios/${id}`);
    } else {
      notify({
        message: "Failed to update scenario",
        description: "Please try again",
        notiType: "error",
      });
    }
  }, [updateScenario, form, router, notify, id]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      onClick={onFinish}
      loading={isLoading}
      icon={<EditOutlined />}
    >
      Save
    </Button>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCreateScenarioMutation } from "@/scenarios/apis/scenarioApi";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { getScenarioStrategy } from "@/scenarios/strategies";
import { ScenarioFlowType } from "@/scenarios/types/scenario";

export default function CreateScenarioButton() {
  const [createScenario, { isLoading }] = useCreateScenarioMutation();
  const router = useRouter();
  const { form } = useScenarioFormContext();

  const onFinish = async () => {
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
      name,
      description,
      type,
      flowType,
      vus,
      groupId,
      duration: durationInSeconds,
      flows: formattedFlows,
    };

    const res = await createScenario(scenario);

    if (!res.error) {
      router.push(`/scenarios`);
    } else {
    }
  };

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

"use client";
import { Card } from "antd";
import Title from "antd/es/typography/Title";
import { useAppSelector } from "@/modules/shared/hooks/useStore";
import { selectType } from "@/modules/scenarios/slices/createScenarioSlice";
import { ApiConfig, WebConfig } from "./simple";
import { ScenarioType } from "@/modules/scenarios/types/scenario";

export default function ScenarioSimpleCard() {
  const type = useAppSelector(selectType);
  return (
    <Card>
      <Title level={4}>Simple Scenario Configuration</Title>
      {renderTypeSpecificFields(type)}
    </Card>
  );
}

const renderTypeSpecificFields = (type: ScenarioType) => {
  switch (type) {
    case ScenarioType.WEB:
      return <WebConfig />;
    case ScenarioType.API:
      return <ApiConfig />;
    // case ScenarioType.DATABASE:
    //   return <DatabaseConfig />;
    // case ScenarioType.USER_FLOW:
    //   return <UserFlowConfig />;
    default:
      return null;
  }
};

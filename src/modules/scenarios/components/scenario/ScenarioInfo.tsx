"use client";
import { useGetScenarioQuery } from "@/scenarios/apis/scenarioApi";
import { setSelectedScenario } from "@/scenarios/slices/scenariosSlice";
import { useAppDispatch } from "@/shared/hooks/useStore";
import { Col, Spin } from "antd";
import { useEffect } from "react";
import { ScenarioCard, ScenarioFlowsCard } from "./info";

export default function ScenarioInfo({ scenarioId }: { scenarioId: string }) {
  const dispatch = useAppDispatch();
  const { data: scenario } = useGetScenarioQuery(scenarioId);

  useEffect(() => {
    if (scenario) {
      dispatch(setSelectedScenario(scenario));
    }
  }, [dispatch, scenario]);

  if (!scenario) {
    return (
      <Col className="flex h-full w-full justify-center">
        <Spin />
      </Col>
    );
  }

  return (
    <>
      <Col span={9}>
        <ScenarioCard scenario={scenario} />
      </Col>
      <Col span={15}>
        <ScenarioFlowsCard scenario={scenario} />
      </Col>
    </>
  );
}

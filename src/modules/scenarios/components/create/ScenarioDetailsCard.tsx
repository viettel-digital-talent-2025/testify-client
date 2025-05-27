"use client";
import { Card, Form, Row, Col } from "antd";
import {
  NameInput,
  DescriptionInput,
  VusInput,
  DurationInput,
  GroupInput,
  ScenarioTypeInput,
  ScenarioFlowInput,
} from "./details";
import Title from "antd/es/typography/Title";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";

export default function ScenarioDetailsCard() {
  const { form } = useScenarioFormContext();
  return (
    <Card>
      <Form form={form} layout="vertical">
        {/* Scenario Details */}
        <Title level={4}>Scenario Details</Title>
        {/* Name */}
        <NameInput />
        {/* Description */}
        <DescriptionInput />

        {/* Common Configuration */}
        <Title level={4}>Common Configuration</Title>
        <Row gutter={16}>
          {/* Vus */}
          <Col span={8}>
            <VusInput />
          </Col>
          {/* Duration */}
          <Col span={8}>
            <DurationInput />
          </Col>
          {/* Group */}
          <Col span={8}>
            <GroupInput />
          </Col>
        </Row>

        {/* Scenario Structure */}
        <Title level={4} className="mb-4">
          Scenario Structure
        </Title>
        {/* Scenario Type */}
        <ScenarioTypeInput />
        {/* Scenario Flow */}
        <ScenarioFlowInput />
      </Form>
    </Card>
  );
}

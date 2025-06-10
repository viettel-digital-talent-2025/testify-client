"use client";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { Card, Col, Form, Row } from "antd";
import Title from "antd/es/typography/Title";
import {
  DescriptionInput,
  DurationInput,
  GroupInput,
  NameInput,
  ScenarioTypeInput,
  VusInput,
} from "./details";

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
        {/* <ScenarioFlowInput /> */}
      </Form>
    </Card>
  );
}

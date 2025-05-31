"use client";
import { Col, Row } from "antd";
import {
  FlowDescriptionInput,
  FlowNameInput,
  FlowStepsInput,
  FlowWeightInput,
} from "./FlowInput";

interface FlowContentProps {
  flowName: number;
}

export default function FlowContent({ flowName }: FlowContentProps) {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          {/* Flow Name */}
          <FlowNameInput flowName={flowName} />
        </Col>
        <Col span={12}>
          {/* Flow Description */}
          <FlowDescriptionInput flowName={flowName} />
        </Col>
      </Row>
      {/* Flow Weight */}
      <FlowWeightInput flowName={flowName} />
      {/* Flow Steps */}
      <FlowStepsInput flowName={flowName} />
      {/* Flow Diagram */}
      {/* <FlowDiagram steps={flow.steps || []} /> */}
    </>
  );
}

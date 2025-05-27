"use client";
import { Row, Col } from "antd";
import {
  FlowNameInput,
  FlowDescriptionInput,
  FlowWeightInput,
  FlowStepsInput,
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

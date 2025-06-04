import { BottleneckDetails, BottlenecksList } from "@/bottlenecks/components";
import { Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";


export default function BottlenecksPage() {
  return (
    <Content
      style={{
        padding: "24px",
        height: "calc(100vh - 64px)",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Row gutter={[16, 16]} style={{ flex: 1, overflow: "hidden" }}>
        <Col span={7} style={{ height: "100%", overflow: "hidden" }}>
          <BottlenecksList />
        </Col>
        <Col span={17} style={{ height: "100%", overflow: "hidden" }}>
          <BottleneckDetails />
        </Col>
      </Row>
    </Content>
  );
}

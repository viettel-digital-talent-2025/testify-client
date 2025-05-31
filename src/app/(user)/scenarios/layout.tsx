import { ScenarioGroups } from "@/scenarios/components";
import { Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";

export default function ScenariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <Row gutter={16} style={{ flex: 1, overflow: "hidden" }}>
        <Col span={5} style={{ height: "100%", overflow: "hidden" }}>
          <ScenarioGroups />
        </Col>
        <Col span={19} style={{ height: "100%", overflow: "hidden" }}>
          {children}
        </Col>
      </Row>
    </Content>
  );
}

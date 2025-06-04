import {
  ScheduleCalendar,
  ScheduleModal,
  UpcomingTests,
} from "@/schedule/components";
import { PageTitle } from "@/shared/components/pages";
import { Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";

export default function SchedulePage() {
  return (
    <Content
      style={{
        padding: "12px 24px",
        height: "calc(100vh - 64px)",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Row gutter={[16, 16]} style={{ flex: 1, overflow: "hidden" }}>
        <Col span={6} style={{ height: "100%", overflow: "hidden" }}>
          <UpcomingTests />
        </Col>
        <Col
          span={18}
          style={{ height: "100%", overflowX: "hidden", overflowY: "auto" }}
        >
          <PageTitle
            title="Test Schedule"
            description="Schedule and manage automated performance tests"
          />
          <ScheduleCalendar />
        </Col>
      </Row>
      <ScheduleModal />
    </Content>
  );
}

import {
  MetricsCard,
  RecentRuns,
  RunningScenarios,
} from "@/dashboard/components";
import { PageTitle } from "@/shared/components/pages";
import { Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";

export default function DashboardPage() {
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
      <div className="flex h-full flex-col gap-2">
        <PageTitle
          title="Dashboard"
          description="Overview of your performance testing metrics and results"
        />

        <Row
          gutter={[16, 16]}
          style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
        >
          <Col span={7}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <RunningScenarios />
              </Col>
              <Col span={24}>
                <RecentRuns />
              </Col>
            </Row>
          </Col>
          <Col span={17}>
            <MetricsCard />
          </Col>
        </Row>
      </div>
    </Content>
  );
}

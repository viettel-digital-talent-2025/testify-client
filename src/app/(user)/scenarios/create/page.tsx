import Link from "next/link";
import { Button, Row, Col, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { PageTitle, PageTitleLayout } from "@/shared/components/pages";
import {
  ScenarioConfigCard,
  ScenarioDetailsCard,
  CreateScenarioButton,
} from "@/scenarios/components/create";

export default function CreateScenarioPage() {
  return (
    <div className="flex h-full flex-col gap-2">
      <PageTitleLayout>
        <PageTitle
          title="Create New Test Scenario"
          description="Define a new performance testing scenario. You can configure endpoints, virtual users, and duration."
        />
        <Space>
          <Link href="/scenarios">
            <Button icon={<ArrowLeftOutlined />}>Back</Button>
          </Link>
          <CreateScenarioButton />
        </Space>
      </PageTitleLayout>

      <Row
        gutter={16}
        style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
      >
        <Col span={10}>
          <ScenarioDetailsCard />
        </Col>
        <Col span={14}>
          <ScenarioConfigCard />
        </Col>
      </Row>
    </div>
  );
}

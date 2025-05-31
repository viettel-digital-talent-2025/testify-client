"use client";
import LoadTestButton from "@/scenarios/components/common/LoadTestButton";
import {
  DetailedMetrics,
  OverallMetrics,
  RunHistory,
  ScenarioInfo,
} from "@/scenarios/components/scenario";
import { setSelectedScenarioId } from "@/scenarios/slices/scenariosSlice";
import { PageTitle } from "@/shared/components/pages";
import { useAppDispatch } from "@/shared/hooks/useStore";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Tabs } from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import "./page.css";

export default function ScenarioPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(setSelectedScenarioId(id as string));
    }
  }, [dispatch, id]);

  const items = useMemo(() => {
    return [
      {
        key: "overview",
        label: "Overview",
        children: (
          <Row
            gutter={[16, 16]}
            style={{
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <ScenarioInfo scenarioId={id as string} />
          </Row>
        ),
      },
      {
        key: "metrics",
        label: "Metrics",
        children: (
          <Row
            gutter={[16, 16]}
            style={{
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Col span={24}>
              <OverallMetrics />
            </Col>
            <Col span={24}>
              <DetailedMetrics />
            </Col>
          </Row>
        ),
      },
      {
        key: "history",
        label: "History",
        children: <RunHistory />,
      },
    ];
  }, [id]);

  return (
    <div className="flex h-full flex-col gap-2">
      <ScenarioPageHeader scenarioId={id as string} />
      <Tabs
        items={items}
        defaultActiveKey="overview"
        onChange={(key) => {
          console.log(key);
        }}
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      />
    </div>
  );
}

function ScenarioPageHeader({ scenarioId }: { scenarioId: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between">
      <PageTitle
        title="Detail Test Scenario"
        description="View the performance testing scenario details."
      />
      <Space>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>
        <Link href={`/scenarios/${scenarioId}/edit`}>
          <Button icon={<EditOutlined />}>Edit</Button>
        </Link>
        <LoadTestButton scenarioId={scenarioId} />
      </Space>
    </div>
  );
}

"use client";
import {
  selectIsDetailModalVisible,
  selectSelectedRun,
  setIsDetailModalVisible,
} from "@/scenarios/slices/runHistoriesSlice";
import { RunHistory } from "@/scenarios/types/runHistory";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
} from "antd";
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";
import { memo, useCallback, useMemo } from "react";
import DetailedMetrics from "../DetailedMetrics";
import { RealtimeMetricsChart } from "../metrics/RealtimeMetricsChart";

interface StepMetric {
  id: string;
  stepId: string;
  flowId: string;
  avgLatency: number;
  p95Latency: number;
  throughput: number;
  errorRate: number;
  flow: {
    id: string;
    name: string;
  };
  step: {
    id: string;
    name: string;
  };
}

const MetricCard = memo(
  ({
    title,
    value,
    suffix,
    valueStyle,
  }: {
    title: string;
    value: string | number;
    suffix?: string;
    valueStyle?: React.CSSProperties;
  }) => (
    <Card size="small" styles={{ body: { padding: "8px 12px" } }}>
      <Statistic
        title={<Text style={{ fontSize: "14px" }}>{title}</Text>}
        value={value}
        suffix={suffix}
        valueStyle={{ fontSize: "14px", ...valueStyle }}
      />
    </Card>
  ),
);

MetricCard.displayName = "MetricCard";

const RunInfoCard = memo(({ run }: { run: RunHistory }) => (
  <Card
    title={<Text style={{ fontSize: "14px" }}>Run Information</Text>}
    size="small"
    styles={{ body: { padding: "12px" } }}
  >
    <Descriptions column={2} size="small">
      <Descriptions.Item
        label={<Text style={{ fontSize: "14px" }}>Run ID</Text>}
      >
        <Text copyable style={{ fontSize: "14px" }}>
          {run.id}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={<Text style={{ fontSize: "14px" }}>Scenario</Text>}
      >
        <Text style={{ fontSize: "14px" }}>{run.scenario?.name}</Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={<Text style={{ fontSize: "14px" }}>Started At</Text>}
      >
        <Text style={{ fontSize: "14px" }}>
          {dayjs(run.runAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("HH:mm:ss DD/MM/YYYY")}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={<Text style={{ fontSize: "14px" }}>Ended At</Text>}
      >
        <Text style={{ fontSize: "14px" }}>
          {dayjs(run.endAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("HH:mm:ss DD/MM/YYYY")}
        </Text>
      </Descriptions.Item>
    </Descriptions>
  </Card>
));

RunInfoCard.displayName = "RunInfoCard";

const OverallPerformanceCard = memo(({ run }: { run: RunHistory }) => (
  <Card
    title={<Text style={{ fontSize: "14px" }}>Overall Performance</Text>}
    size="small"
    styles={{ body: { padding: "12px" } }}
  >
    <Row gutter={[8, 8]}>
      <Col span={6}>
        <MetricCard
          title="Average Response Time"
          value={run.avgLatency.toFixed(2)}
          suffix="ms"
        />
      </Col>
      <Col span={6}>
        <MetricCard
          title="P95 Latency"
          value={run.p95Latency.toFixed(2)}
          suffix="ms"
        />
      </Col>
      <Col span={6}>
        <MetricCard
          title="Throughput"
          value={run.throughput.toFixed(2)}
          suffix="req/s"
        />
      </Col>
      <Col span={6}>
        <MetricCard
          title="Error Rate"
          value={run.errorRate * 100}
          suffix="%"
          valueStyle={{
            color:
              run.errorRate > 0.9
                ? "#52c41a"
                : run.errorRate > 0.7
                  ? "#faad14"
                  : "#ff4d4f",
          }}
        />
      </Col>
    </Row>
  </Card>
));

OverallPerformanceCard.displayName = "OverallPerformanceCard";

const StepMetrics = memo(({ metrics }: { metrics: StepMetric[] }) => {
  const columns = useMemo(
    () => [
      {
        title: "Flow",
        dataIndex: ["flow", "name"],
        key: "flow",
        width: 120,
        render: (name: string) => (
          <Text style={{ fontSize: "14px" }}>{name}</Text>
        ),
        sorter: (a: StepMetric, b: StepMetric) =>
          a.flow.name.localeCompare(b.flow.name),
      },
      {
        title: "Step",
        dataIndex: ["step", "name"],
        key: "step",
        width: 180,
        render: (name: string) => (
          <Text style={{ fontSize: "14px" }}>{name}</Text>
        ),
        sorter: (a: StepMetric, b: StepMetric) =>
          a.step.name.localeCompare(b.step.name),
      },
      {
        title: "Avg Latency",
        dataIndex: "avgLatency",
        key: "avgLatency",
        width: 100,
        render: (value: number) => (
          <Text style={{ fontSize: "14px" }}>{`${value.toFixed(2)}ms`}</Text>
        ),
        sorter: (a: StepMetric, b: StepMetric) => a.avgLatency - b.avgLatency,
      },
      {
        title: "P95 Latency",
        dataIndex: "p95Latency",
        key: "p95Latency",
        width: 100,
        render: (value: number) => (
          <Text style={{ fontSize: "14px" }}>{`${value.toFixed(2)}ms`}</Text>
        ),
        sorter: (a: StepMetric, b: StepMetric) => a.p95Latency - b.p95Latency,
      },
      {
        title: "Throughput",
        dataIndex: "throughput",
        key: "throughput",
        width: 100,
        render: (value: number) => (
          <Text style={{ fontSize: "14px" }}>{`${value.toFixed(2)}req/s`}</Text>
        ),
        sorter: (a: StepMetric, b: StepMetric) => a.throughput - b.throughput,
      },
      {
        title: "Error Rate",
        dataIndex: "errorRate",
        key: "errorRate",
        width: 100,
        render: (value: number) => (
          <Text style={{ fontSize: "14px" }}>{`${value.toFixed(2)}%`}</Text>
        ),
        sorter: (a: StepMetric, b: StepMetric) => a.errorRate - b.errorRate,
      },
    ],
    [],
  );

  const summaryStats = useMemo(() => {
    const totalSteps = metrics.length;
    const successSteps = metrics.filter((m) => m.errorRate === 0).length;
    const avgLatency =
      metrics.reduce((acc, m) => acc + m.avgLatency, 0) / totalSteps;
    const maxP95Latency = Math.max(...metrics.map((m) => m.p95Latency));
    const totalThroughput = metrics.reduce((acc, m) => acc + m.throughput, 0);

    return (
      <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
        <Col span={6}>
          <MetricCard
            title="Total Steps"
            value={totalSteps}
            suffix={`(${successSteps} success)`}
          />
        </Col>
        <Col span={6}>
          <MetricCard
            title="Avg Step Latency"
            value={avgLatency.toFixed(2)}
            suffix="ms"
          />
        </Col>
        <Col span={6}>
          <MetricCard
            title="Max P95 Latency"
            value={maxP95Latency.toFixed(2)}
            suffix="ms"
          />
        </Col>
        <Col span={6}>
          <MetricCard
            title="Total Throughput"
            value={totalThroughput.toFixed(2)}
            suffix="req/s"
          />
        </Col>
      </Row>
    );
  }, [metrics]);

  return (
    <Card
      title={<Text style={{ fontSize: "14px" }}>Step Metrics</Text>}
      size="small"
      styles={{ body: { padding: "12px" } }}
    >
      {summaryStats}
      <Table
        columns={columns}
        dataSource={metrics}
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ x: 800 }}
        className="small-text-table"
      />
    </Card>
  );
});

StepMetrics.displayName = "StepMetrics";

export default function RunDetailModal() {
  const dispatch = useAppDispatch();
  const run = useAppSelector(selectSelectedRun);
  const open = useAppSelector(selectIsDetailModalVisible);

  const onCancel = useCallback(() => {
    dispatch(setIsDetailModalVisible(false));
  }, [dispatch]);

  if (!run) return null;

  return (
    <Modal
      title={<Text style={{ fontSize: "14px" }}>Run Details</Text>}
      open={open}
      onCancel={onCancel}
      width={1200}
      footer={null}
      destroyOnHidden
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <RunInfoCard run={run} />
          </Col>
        </Row>

        <Row gutter={[8, 8]}>
          <Col span={24}>
            <OverallPerformanceCard run={run} />
          </Col>
        </Row>

        {run.runHistoryMetrics?.length > 0 && (
          <StepMetrics metrics={run.runHistoryMetrics} />
        )}

        <RealtimeMetricsChart
          isRunning={false}
          scenarioId={run.scenarioId}
          runHistoryId={run.id}
          showProgress={false}
          showFilter={true}
        />
        <DetailedMetrics />
      </Space>
    </Modal>
  );
}

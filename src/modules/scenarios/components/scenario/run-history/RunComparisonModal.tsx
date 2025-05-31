"use client";
import {
  selectIsCompareModalVisible,
  selectSelectedRuns,
  setIsCompareModalVisible,
} from "@/scenarios/slices/runHistoriesSlice";
import { Metrics } from "@/scenarios/types/metrics";
import { RunHistory } from "@/scenarios/types/runHistory";
import { colors } from "@/shared/constants/colors";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Modal, Space, Table, TableColumnType, Tag, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";

export default function RunComparisonModal() {
  const dispatch = useAppDispatch();
  const runs = useAppSelector(selectSelectedRuns);
  const open = useAppSelector(selectIsCompareModalVisible);

  const onClose = useCallback(() => {
    dispatch(setIsCompareModalVisible(false));
  }, [dispatch]);

  // Sort runs by time to calculate trends
  const sortedRuns = useMemo(
    () =>
      [...runs].sort(
        (a, b) => dayjs(a.runAt).valueOf() - dayjs(b.runAt).valueOf(),
      ),
    [runs],
  );

  const columns: TableColumnType<Metrics>[] = useMemo(
    () => [
      {
        title: "Metric",
        dataIndex: "metric",
        key: "metric",
        width: 250,
        render: (text: string, record: Metrics) => (
          <Space>
            <Text>{text}</Text>
            {record.description && (
              <Tooltip title={record.description}>
                <InfoCircleOutlined style={{ color: colors.gray }} />
              </Tooltip>
            )}
          </Space>
        ),
      },
      ...sortedRuns.map((run, index) => ({
        title: (
          <Space direction="vertical" size={0}>
            <Text strong>{dayjs(run.runAt).format("MMM D, HH:mm")}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {dayjs(run.runAt).fromNow()}
            </Text>
          </Space>
        ),
        dataIndex: run.id,
        key: run.id,
        width: 180,
        render: (value: number | string, record: Metrics) => {
          const formattedValue =
            record.format && typeof value === "number"
              ? record.format(value)
              : value;
          if (index === 0) return formattedValue;

          const prevRun = sortedRuns[index - 1];
          const prevValue = record[prevRun.id];
          const diff =
            record.calculateDiff &&
            typeof value === "number" &&
            typeof prevValue === "number"
              ? record.calculateDiff(value, prevValue)
              : 0;
          const isBetter = record.isBetter ? record.isBetter(diff) : false;

          return (
            <Space>
              <Text>{formattedValue}</Text>
              {diff !== 0 && (
                <Tag color={isBetter ? colors.success : colors.error}>
                  {diff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(diff).toFixed(1)}%
                </Tag>
              )}
            </Space>
          );
        },
      })),
    ],
    [sortedRuns],
  );

  const calculatePercentageDiff = useCallback(
    (current: number, previous: number) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    },
    [],
  );

  const metrics: Metrics[] = useMemo(
    () => [
      {
        key: "duration",
        metric: "Duration",
        description: "Total duration of the test run",
        format: (value: number) => {
          const h = Math.floor(value / 3600);
          const m = Math.floor((value % 3600) / 60);
          const s = value % 60;
          const parts = [];
          if (h) parts.push(`${h}h`);
          if (m) parts.push(`${m}m`);
          if (s || (!h && !m)) parts.push(`${s}s`);
          return parts.join(" ");
        },
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff < 0, // Shorter duration is better
      },
      {
        key: "vus",
        metric: "Virtual Users",
        description: "Number of concurrent virtual users",
        format: (value: number) => value.toString(),
      },
      {
        key: "totalRequests",
        metric: "Total Requests",
        description: "Total number of requests made during the test",
        format: (value: number) => value.toLocaleString(),
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff > 0, // More requests is better
      },
      {
        key: "avgResponseTime",
        metric: "Avg Response Time",
        description: "Average response time across all requests",
        format: (value: number) => `${value.toFixed(2)}ms`,
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff < 0, // Lower response time is better
      },
      {
        key: "p95ResponseTime",
        metric: "95th Percentile Response Time",
        description: "95% of requests completed within this time",
        format: (value: number) => `${value.toFixed(2)}ms`,
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff < 0,
      },
      {
        key: "p99ResponseTime",
        metric: "99th Percentile Response Time",
        description: "99% of requests completed within this time",
        format: (value: number) => `${value.toFixed(2)}ms`,
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff < 0,
      },
      {
        key: "successRate",
        metric: "Success Rate",
        description: "Percentage of successful requests",
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
        calculateDiff: (current, previous) => (current - previous) * 100,
        isBetter: (diff) => diff > 0,
      },
      {
        key: "errorRate",
        metric: "Error Rate",
        description: "Percentage of failed requests",
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
        calculateDiff: (current, previous) => (current - previous) * 100,
        isBetter: (diff) => diff < 0,
      },
      {
        key: "requestsPerSecond",
        metric: "Throughput",
        description: "Average number of requests processed per second",
        format: (value: number) => `${value.toFixed(2)} req/s`,
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff > 0,
      },
      {
        key: "dataTransferred",
        metric: "Data Transferred",
        description: "Total amount of data transferred during the test",
        format: (value: number) => {
          const mb = value / (1024 * 1024);
          return `${mb.toFixed(2)} MB`;
        },
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff > 0,
      },
      {
        key: "avgRequestSize",
        metric: "Avg Request Size",
        description: "Average size of each request",
        format: (value: number) => {
          const kb = value / 1024;
          return `${kb.toFixed(2)} KB`;
        },
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff < 0,
      },
    ],
    [calculatePercentageDiff],
  );

  const data = useMemo(
    () =>
      metrics.map((metric) => ({
        ...metric,
        ...sortedRuns.reduce(
          (acc, run) => ({
            ...acc,
            [run.id]: run[metric.key as keyof RunHistory],
          }),
          {},
        ),
      })),
    [metrics, sortedRuns],
  );

  return (
    <Modal
      title={
        <Space>
          <Text strong>Compare Runs</Text>
          <Tag color={colors.primary}>{sortedRuns.length} runs</Tag>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
    >
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        scroll={{ x: "max-content" }}
      />
    </Modal>
  );
}

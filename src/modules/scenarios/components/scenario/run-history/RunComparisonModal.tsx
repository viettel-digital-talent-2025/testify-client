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
import { Modal, Space, Table, Tabs, Tag, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";

interface FlowStepMetric {
  flowId: string;
  flowName: string;
  stepId: string;
  stepName: string;
  avgLatency: number;
  p95Latency: number;
  throughput: number;
  errorRate: number;
}

interface MetricValue {
  avgLatency: number;
  p95Latency: number;
  throughput: number;
  errorRate: number;
}

const createRunColumn = (run: RunHistory) => ({
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
});

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

  // Extract all unique flow-step combinations
  const flowStepCombinations = useMemo(() => {
    const combinations = new Map<string, FlowStepMetric>();

    sortedRuns.forEach((run) => {
      run.runHistoryMetrics.forEach((metric) => {
        const key = `${metric.flowId}-${metric.stepId}`;
        if (!combinations.has(key)) {
          combinations.set(key, {
            flowId: metric.flowId,
            flowName: metric.flow.name,
            stepId: metric.stepId,
            stepName: metric.step.name,
            avgLatency: 0,
            p95Latency: 0,
            throughput: 0,
            errorRate: 0,
          });
        }
      });
    });

    return Array.from(combinations.values());
  }, [sortedRuns]);

  const calculatePercentageDiff = useCallback(
    (current: number, previous: number) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    },
    [],
  );

  const overviewMetrics: Metrics[] = useMemo(
    () => [
      {
        key: "avgLatency",
        metric: "Average Latency",
        description: "Average response time across all requests",
        format: (value: number) => `${value.toFixed(2)}ms`,
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff < 0, // Lower latency is better
      },
      {
        key: "p95Latency",
        metric: "95th Percentile Latency",
        description: "95% of requests completed within this time",
        format: (value: number) => `${value.toFixed(2)}ms`,
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff < 0,
      },
      {
        key: "throughput",
        metric: "Throughput",
        description: "Average number of requests processed per second",
        format: (value: number) => `${value.toFixed(2)} req/s`,
        calculateDiff: calculatePercentageDiff,
        isBetter: (diff) => diff > 0, // Higher throughput is better
      },
      {
        key: "errorRate",
        metric: "Error Rate",
        description: "Percentage of failed requests",
        format: (value: number) => `${value.toFixed(2)}%`,
        calculateDiff: (current, previous) => current - previous,
        isBetter: (diff) => diff < 0, // Lower error rate is better
      },
    ],
    [calculatePercentageDiff],
  );

  const createColumns = useCallback(() => {
    return [
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
        ...createRunColumn(run),
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
            <div className="flex items-center justify-between">
              <Text>{formattedValue}</Text>
              {diff !== 0 && (
                <Tag
                  color={isBetter ? "green" : "red"}
                  style={{ marginRight: 0 }}
                >
                  {diff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(diff).toFixed(1)}%
                </Tag>
              )}
            </div>
          );
        },
      })),
    ];
  }, [sortedRuns]);

  const overviewData = useMemo(
    () =>
      overviewMetrics.map((metric) => ({
        ...metric,
        ...sortedRuns.reduce(
          (acc, run) => ({
            ...acc,
            [run.id]: run[metric.key as keyof RunHistory],
          }),
          {},
        ),
      })),
    [overviewMetrics, sortedRuns],
  );

  // Group flow-step combinations by flow
  const flowsGrouped = useMemo(() => {
    const grouped = new Map<string, FlowStepMetric[]>();

    flowStepCombinations.forEach((combination) => {
      if (!grouped.has(combination.flowName)) {
        grouped.set(combination.flowName, []);
      }
      grouped.get(combination.flowName)!.push(combination);
    });

    return grouped;
  }, [flowStepCombinations]);

  const createStepData = useCallback(
    (flowName: string) => {
      const steps = flowsGrouped.get(flowName) || [];

      return steps.map((step) => {
        const stepData: Record<string, unknown> = {
          key: `${step.flowId}-${step.stepId}`,
          stepName: step.stepName,
          flowName: step.flowName,
          flowId: step.flowId,
          stepId: step.stepId,
        };

        // Add metrics for each run
        sortedRuns.forEach((run) => {
          const metric = run.runHistoryMetrics.find(
            (m) => m.flowId === step.flowId && m.stepId === step.stepId,
          );

          if (metric) {
            stepData[run.id] = {
              avgLatency: metric.avgLatency,
              p95Latency: metric.p95Latency,
              throughput: metric.throughput,
              errorRate: metric.errorRate,
            };
          }
        });

        return stepData;
      });
    },
    [flowsGrouped, sortedRuns],
  );

  // Move renderStepMetrics above createStepColumns
  const renderStepMetrics = useCallback(
    (value: unknown, record: Record<string, unknown>, index: number) => {
      if (!value || typeof value !== "object") return "-";
      const metrics = value as MetricValue;
      if (index === 0) {
        return (
          <Space direction="vertical" size={2}>
            <Text>{metrics.avgLatency.toFixed(2)}ms</Text>
            <Text>{metrics.p95Latency.toFixed(2)}ms</Text>
            <Text>{metrics.throughput.toFixed(2)} req/s</Text>
            <Text>{metrics.errorRate.toFixed(2)}%</Text>
          </Space>
        );
      }
      const prevRun = sortedRuns[index - 1];
      const flowId = record.flowId as string;
      const stepId = record.stepId as string;
      const prevValue = prevRun.runHistoryMetrics.find(
        (m) => m.flowId === flowId && m.stepId === stepId,
      );
      if (!prevValue) {
        return (
          <Space direction="vertical" size={2}>
            <Text>{metrics.avgLatency.toFixed(2)}ms</Text>
            <Text>{metrics.p95Latency.toFixed(2)}ms</Text>
            <Text>{metrics.throughput.toFixed(2)} req/s</Text>
            <Text>{metrics.errorRate.toFixed(2)}%</Text>
          </Space>
        );
      }
      const avgDiff = calculatePercentageDiff(
        metrics.avgLatency,
        prevValue.avgLatency,
      );
      const p95Diff = calculatePercentageDiff(
        metrics.p95Latency,
        prevValue.p95Latency,
      );
      const throughputDiff = calculatePercentageDiff(
        metrics.throughput,
        prevValue.throughput,
      );
      const errorDiff = metrics.errorRate - prevValue.errorRate;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Text>{metrics.avgLatency.toFixed(2)}ms</Text>
            {avgDiff !== 0 && (
              <Tag
                color={avgDiff < 0 ? "green" : "red"}
                style={{ marginRight: 0 }}
              >
                {avgDiff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(avgDiff).toFixed(1)}%
              </Tag>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Text>{metrics.p95Latency.toFixed(2)}ms</Text>
            {p95Diff !== 0 && (
              <Tag
                color={p95Diff < 0 ? "green" : "red"}
                style={{ marginRight: 0 }}
              >
                {p95Diff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(p95Diff).toFixed(1)}%
              </Tag>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Text>{metrics.throughput.toFixed(2)} req/s</Text>
            {throughputDiff !== 0 && (
              <Tag
                color={throughputDiff > 0 ? "green" : "red"}
                style={{ marginRight: 0 }}
              >
                {throughputDiff > 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
                {Math.abs(throughputDiff).toFixed(1)}%
              </Tag>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Text>{metrics.errorRate.toFixed(2)}%</Text>
            {errorDiff !== 0 && (
              <Tag
                color={errorDiff < 0 ? "green" : "red"}
                style={{ marginRight: 0 }}
              >
                {errorDiff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(errorDiff).toFixed(1)}%
              </Tag>
            )}
          </div>
        </div>
      );
    },
    [sortedRuns, calculatePercentageDiff],
  );

  const createStepColumns = useCallback(() => {
    return [
      {
        title: "Step",
        dataIndex: "stepName",
        key: "stepName",
        width: 260,
        render: (text: string) => (
          <div className="flex items-center justify-between">
            <Text strong>{text}</Text>
            <div className="flex flex-col gap-1">
              <Text type="secondary">Avg Latency</Text>
              <Text type="secondary">P95 Latency</Text>
              <Text type="secondary">Throughput</Text>
              <Text type="secondary">Error Rate</Text>
            </div>
          </div>
        ),
      },
      ...sortedRuns.map((run, index) => ({
        ...createRunColumn(run),
        render: (value: unknown, record: Record<string, unknown>) =>
          renderStepMetrics(value, record, index),
      })),
    ];
  }, [sortedRuns, renderStepMetrics]);

  const tabItems = useMemo(() => {
    const items = [
      {
        key: "overview",
        label: "Overview",
        children: (
          <Table
            size="small"
            columns={createColumns()}
            dataSource={overviewData}
            pagination={false}
            bordered
            scroll={{ x: "max-content" }}
          />
        ),
      },
    ];

    // Add tabs for each flow
    flowsGrouped.forEach((steps, flowName) => {
      items.push({
        key: flowName,
        label: flowName,
        children: (
          <Table
            size="small"
            columns={createStepColumns()}
            dataSource={createStepData(flowName)}
            pagination={false}
            bordered
            scroll={{ x: "max-content" }}
          />
        ),
      });
    });

    return items;
  }, [
    overviewData,
    flowsGrouped,
    createColumns,
    createStepColumns,
    createStepData,
  ]);

  return (
    <Modal
      title={
        <Space>
          <Text strong>Compare Runs</Text>
          <Tag color={colors.primary}>{sortedRuns.length} runs</Tag>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {sortedRuns.length > 0 && (
              <>
                Comparing runs from{" "}
                {dayjs(sortedRuns[0].runAt).format("MMM D, HH:mm")} to{" "}
                {dayjs(sortedRuns[sortedRuns.length - 1].runAt).format(
                  "MMM D, HH:mm",
                )}
              </>
            )}
          </Text>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1400}
      footer={null}
    >
      <Tabs
        defaultActiveKey="overview"
        items={tabItems}
        size="small"
        style={{ marginTop: 16 }}
      />
    </Modal>
  );
}

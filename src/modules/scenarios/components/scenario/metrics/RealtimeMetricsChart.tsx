"use client";
import { Bottleneck } from "@/bottlenecks/types/bottleneck";
import { useGetMetricsQuery } from "@/scenarios/apis/metricsApi";
import { selectIsScenarioRunning } from "@/scenarios/slices/metricsSlice";
import {
  selectSelectedScenario,
  selectSelectedSteps,
  setSelectedSteps,
} from "@/scenarios/slices/scenariosSlice";
import { colors } from "@/shared/constants/colors";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Card, Col, Progress, Row, Select, Spin, Tag } from "antd";
import Text from "antd/es/typography/Text";
import AntTitle from "antd/es/typography/Title";
import {
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  TooltipItem,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import dayjs from "dayjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  ChartItem,
  createChartData,
  createChartOptions,
  formatTime,
} from "../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  annotationPlugin,
);

export function RealtimeMetricsChart({
  id,
  flowId,
  stepId,
  runHistoryId,
  title,
  showFilter = false,
  showViewDetails = false,
  showScenarioName = false,
  showLastUpdated = true,
  showProgress = true,
  bottlenecks,
  style,
}: {
  id?: string | null;
  flowId?: string;
  stepId?: string;
  runHistoryId?: string;
  title?: string;
  showViewDetails?: boolean;
  showFilter?: boolean;
  showScenarioName?: boolean;
  showLastUpdated?: boolean;
  showProgress?: boolean;
  bottlenecks?: Bottleneck[];
  style?: React.CSSProperties;
}) {
  const isRunning = useAppSelector((state) =>
    selectIsScenarioRunning(state, id as string),
  );

  const { data: metrics, isLoading } = useGetMetricsQuery(
    {
      scenarioId: id as string,
      runHistoryId,
      flowId,
      stepId,
      duration: "300",
      interval: "5s",
    },
    {
      skip: !id,
      pollingInterval: isRunning ? 1000 : 0,
    },
  );

  if (isLoading) {
    return (
      <Card>
        <div
          style={{
            height: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card style={style}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <AntTitle level={4} style={{ marginBottom: 0 }}>
              {title ? title : "Realtime Metrics"}
              {showScenarioName &&
                metrics?.scenarioName &&
                ` - ${metrics?.scenarioName}`}
            </AntTitle>
            {isRunning && (
              <Tag color="processing" style={{ marginLeft: 8 }}>
                Live
              </Tag>
            )}
          </div>
          {showFilter && <RealtimeMetricsFilter />}
          {showViewDetails && (
            <Link href={`/scenarios/${id}`}>View Details</Link>
          )}
        </div>
        <Row gutter={[16, 16]}>
          {(showLastUpdated || showProgress) && (
            <Col span={24}>
              {showLastUpdated && (
                <div className="flex items-center justify-between">
                  <Text type="secondary">
                    Last updated:{" "}
                    {dayjs(metrics?.lastUpdated).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                  <div className="flex gap-2">
                    <Text type="secondary">
                      Run at:{" "}
                      {dayjs(metrics?.runAt).format("YYYY-MM-DD HH:mm:ss")} -
                    </Text>
                    <Text type="secondary">
                      End at:{" "}
                      {metrics?.endAt
                        ? dayjs(metrics?.endAt).format("YYYY-MM-DD HH:mm:ss")
                        : "N/A"}
                    </Text>
                  </div>
                </div>
              )}
              {showProgress && (
                <Progress
                  size="small"
                  percent={metrics?.progress ?? 0}
                  status={metrics?.progress === 100 ? "success" : "active"}
                />
              )}
            </Col>
          )}
          <Col xs={24} md={8}>
            <LineMetricsCard
              data={metrics?.metrics?.latency ?? []}
              label="Latency (ms)"
              color={colors.blue}
              valueKey="avg"
              unit="ms"
              bottlenecks={bottlenecks}
              metricType="latency"
            />
          </Col>
          <Col xs={24} md={8}>
            <LineMetricsCard
              data={metrics?.metrics?.throughput ?? []}
              label="Throughput (req/s)"
              color={colors.green}
              valueKey="value"
              unit="req/s"
              bottlenecks={bottlenecks}
              metricType="throughput"
            />
          </Col>
          <Col xs={24} md={8}>
            <LineMetricsCard
              data={metrics?.metrics?.errorRate ?? []}
              label="Error Rate (%)"
              color={colors.error}
              valueKey="value"
              unit="%"
              bottlenecks={bottlenecks}
              metricType="errorRate"
            />
          </Col>
        </Row>
      </div>
    </Card>
  );
}

function RealtimeMetricsFilter() {
  const dispatch = useAppDispatch();
  const scenario = useAppSelector(selectSelectedScenario);
  const selectedSteps = useAppSelector(selectSelectedSteps);

  useEffect(() => {
    dispatch(setSelectedSteps([]));
  }, [dispatch, scenario]);

  const options = useMemo(() => {
    const allSteps =
      scenario?.flows
        .map((flow) => {
          const stepOptions = flow.steps.map((step) => ({
            label: `${flow.name} - ${step.name}`,
            value: `${flow.id}:${step.id}`,
            flowId: flow.id,
            stepId: step.id,
            flowName: flow.name,
            stepName: step.name,
          }));

          return flow.steps.length > 1
            ? [
                {
                  label: `${flow.name}`,
                  value: `${flow.id}:`,
                  flowId: flow.id,
                  stepId: "",
                  flowName: flow.name,
                  stepName: "",
                },
                ...stepOptions,
              ]
            : stepOptions;
        })
        .flat() || [];

    return allSteps;
  }, [scenario]);

  const handleStepSelect = useCallback(
    (values: string[]) => {
      const newSelectedSteps = values.map((value) => {
        const [flowId, stepId] = value.split(":");
        const option = options.find((opt) => opt.value === value);
        return {
          flowId,
          stepId,
          flowName: option?.flowName || "",
          stepName: option?.stepName || "",
        };
      });
      dispatch(setSelectedSteps(newSelectedSteps));
    },
    [dispatch, options],
  );

  const isSingleStep =
    scenario?.flows?.length === 1 && scenario?.flows[0].steps.length === 1;

  return (
    <div className="flex items-center justify-between gap-4">
      <Select
        allowClear
        mode="multiple"
        placeholder="Select steps to compare metrics"
        onChange={handleStepSelect}
        options={options}
        value={
          isSingleStep
            ? [`${scenario?.flows[0].id}:${scenario?.flows[0].steps[0].id}`]
            : selectedSteps.map((step) => `${step.flowId}:${step.stepId}`)
        }
        maxTagCount={1}
        disabled={!scenario?.flows.length || isSingleStep}
        style={{ width: "300px" }}
      />
    </div>
  );
}

interface LineMetricsCardProps {
  data: ChartItem[];
  label: string;
  unit: string;
  color: string;
  valueKey: "value" | "avg" | "p95";
  bottlenecks?: Bottleneck[];
  metricType: "latency" | "throughput" | "errorRate";
}

// Define annotation types
interface PointAnnotationOptions {
  type: "point";
  xValue: string;
  yValue: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  radius: number;
  pointStyle: "star";
  label?: {
    enabled: boolean;
    content: string;
    position: "top";
  };
}

function LineMetricsCard({
  data,
  label,
  unit,
  color,
  valueKey,
  bottlenecks,
}: LineMetricsCardProps) {
  // Create a map of bottlenecks by timestamp for exact matching
  const bottlenecksByTimestamp = useMemo(() => {
    const map = new Map<string, Bottleneck>();
    bottlenecks?.forEach((bottleneck) => {
      // Convert Date to string timestamp for consistent formatting
      const timestamp = formatTime(bottleneck.timestamp.toString());
      map.set(timestamp, bottleneck);
    });
    return map;
  }, [bottlenecks]);

  const options = useMemo(() => {
    const baseOptions = createChartOptions(label);
    const bottleneckPoints: PointAnnotationOptions[] = data
      .filter((d) => bottlenecksByTimestamp.has(formatTime(d.timestamp)))
      .map((d) => ({
        type: "point" as const,
        xValue: formatTime(d.timestamp),
        yValue: d[valueKey] ?? 0,
        backgroundColor: colors.error,
        borderColor: colors.error,
        borderWidth: 2,
        radius: 6,
        pointStyle: "star",
        label: {
          enabled: true,
          content: "Bottleneck",
          position: "top",
        },
      }));

    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...createChartOptions(label).plugins?.tooltip,
          callbacks: {
            title: (items: { dataIndex: number; label: string }[]) => {
              const timestamp = items[0].label;
              const bottleneck = bottlenecksByTimestamp.get(timestamp);

              if (bottleneck) {
                return `${timestamp} (Bottleneck Detected)`;
              }
              return timestamp;
            },
            label: (item: TooltipItem<"line">) => {
              const timestamp = formatTime(data[item.dataIndex].timestamp);
              const bottleneck = bottlenecksByTimestamp.get(timestamp);

              const value = (item.raw as number).toFixed(5);
              if (bottleneck) {
                const lines = [
                  `${item.dataset.label}: ${value} ${unit}`,
                  `Severity: ${bottleneck.severity}`,
                ];
                if (bottleneck.analysis) {
                  lines.push(`Analysis: ${bottleneck.analysis}`);
                }
                return lines;
              }
              return `${item.dataset.label}: ${value} ${unit}`;
            },
          },
        },
        annotation: {
          annotations: bottleneckPoints,
        },
      },
    };
  }, [label, unit, bottlenecksByTimestamp, data, valueKey]);

  return (
    <Card size="small" title={label}>
      <div style={{ height: "300px" }}>
        <Line
          data={createChartData(data, label, color, valueKey)}
          options={options}
        />
      </div>
    </Card>
  );
}

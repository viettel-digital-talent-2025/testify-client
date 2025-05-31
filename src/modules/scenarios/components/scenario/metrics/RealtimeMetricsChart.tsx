"use client";
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
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import dayjs from "dayjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ChartItem, createChartData, createChartOptions } from "../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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
}) {
  const isRunning = useAppSelector((state) =>
    selectIsScenarioRunning(state, id as string),
  );

  const { data: metrics, isLoading } = useGetMetricsQuery(
    {
      scenarioId: id as string,
      duration: "300",
      flowId,
      stepId,
      runHistoryId,
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
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <AntTitle level={4} style={{ marginBottom: 0 }}>
              {title ? title : "Realtime Metrics"}
              {showScenarioName &&
                metrics?.scenarioName &&
                `- ${metrics?.scenarioName}`}
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
            />
          </Col>
          <Col xs={24} md={8}>
            <LineMetricsCard
              data={metrics?.metrics?.throughput ?? []}
              label="Throughput (req/s)"
              color={colors.green}
              valueKey="value"
              unit="req/s"
            />
          </Col>
          <Col xs={24} md={8}>
            <LineMetricsCard
              data={metrics?.metrics?.errorRate ?? []}
              label="Error Rate (%)"
              color={colors.error}
              valueKey="value"
              unit="%"
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
          return [
            {
              label: `${flow.name} - All Steps`,
              value: `${flow.id}:`,
              flowId: flow.id,
              stepId: null,
              flowName: flow.name,
              stepName: null,
            },
            ...flow.steps.map((step) => ({
              label: `${flow.name} - ${step.name}`,
              value: `${flow.id}:${step.id}`,
              flowId: flow.id,
              stepId: step.id,
              flowName: flow.name,
              stepName: step.name,
            })),
          ];
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

  return (
    <div className="flex items-center justify-between gap-4">
      <Select
        allowClear
        mode="multiple"
        placeholder="Select steps to compare metrics"
        onChange={handleStepSelect}
        options={options}
        value={selectedSteps.map((step) => `${step.flowId}:${step.stepId}`)}
        maxTagCount={1}
        disabled={!scenario?.flows.length}
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
}

function LineMetricsCard({
  data,
  label,
  unit,
  color,
  valueKey,
}: LineMetricsCardProps) {
  const options = useMemo(() => {
    const baseOptions = createChartOptions(label);
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...createChartOptions(label).plugins?.tooltip,
          callbacks: {
            title: (items: { dataIndex: number; label: string }[]) => {
              return items[0].label;
            },
            label: (item: TooltipItem<"line">) => {
              return `${item.dataset.label}: ${(item.raw as number).toFixed(2)} ${unit}`;
            },
          },
        },
      },
    };
  }, [label, unit]);

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

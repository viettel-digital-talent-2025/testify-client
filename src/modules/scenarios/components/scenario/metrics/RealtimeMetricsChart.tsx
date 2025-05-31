"use client";
import { useGetMetricsQuery } from "@/scenarios/apis/metricsApi";
import { selectIsScenarioRunning } from "@/scenarios/slices/metricsSlice";
import { selectSelectedScenarioId } from "@/scenarios/slices/scenariosSlice";
import { colors } from "@/shared/constants/colors";
import { useAppSelector } from "@/shared/hooks";
import { Card, Col, Progress, Row, Spin } from "antd";
import Text from "antd/es/typography/Text";
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
import { useMemo } from "react";
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
  flowId,
  stepId,
  showLastUpdated = true,
  showProgress = true,
}: {
  flowId?: string;
  stepId?: string;
  showLastUpdated?: boolean;
  showProgress?: boolean;
}) {
  const id = useAppSelector(selectSelectedScenarioId);
  const isRunning = useAppSelector((state) =>
    selectIsScenarioRunning(state, id as string),
  );

  const { data: metrics, isLoading } = useGetMetricsQuery(
    {
      scenarioId: id as string,
      duration: "300",
      flowId,
      stepId,
    },
    {
      pollingInterval: isRunning ? 1000 : 0,
      skip: !id,
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
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {showLastUpdated && (
          <div className="flex items-center justify-between">
            <Text type="secondary">
              Last updated:{" "}
              {dayjs(metrics?.lastUpdated).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
            <div className="flex gap-2">
              <Text type="secondary">
                Run at: {dayjs(metrics?.runAt).format("YYYY-MM-DD HH:mm:ss")} -
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
            percent={metrics?.progress ?? 0}
            status={metrics?.progress === 100 ? "success" : "active"}
          />
        )}
      </Col>
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

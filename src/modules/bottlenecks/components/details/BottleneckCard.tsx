"use client";
import { Bottleneck } from "@/bottlenecks/types/bottleneck";
import { getScenarioStatsIcon } from "@/scenarios/utils";
import {
  ClockCircleOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Card, Statistic, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import { formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";
import { getSeverityColor } from "../../utils";

export default function BottleneckCard({
  bottleneck,
  showFlowStep = false,
}: {
  bottleneck: Bottleneck;
  showFlowStep?: boolean;
}) {
  return (
    <Card>
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="">
            <WarningOutlined
              style={{
                marginRight: 8,
                color: getSeverityColor(bottleneck.severity),
              }}
            />
            <Text strong>{bottleneck.severity} Severity</Text>
          </div>
          {showFlowStep && (
            <div className="flex items-center gap-2">
              <div className="">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {getScenarioStatsIcon("flows")}
                </Text>{" "}
                <Text style={{ fontSize: 12 }}>{bottleneck.flow.name}</Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {getScenarioStatsIcon("steps")}
                </Text>{" "}
                <Text style={{ fontSize: 12 }}>{bottleneck.step.name}</Text>
              </div>
            </div>
          )}
        </div>

        <Tooltip
          title={dayjs(bottleneck.timestamp).format("HH:mm:ss DD/MM/YYYY")}
        >
          <Text
            type="secondary"
            style={{ margin: 0, marginTop: 4, fontSize: 12 }}
          >
            {formatDistanceToNow(bottleneck.timestamp, { addSuffix: true })}
          </Text>
        </Tooltip>
      </div>

      <div className="flex justify-between gap-2">
        <Statistic
          title="Latency"
          value={bottleneck.avgLatency.toFixed(2)}
          suffix="ms"
          prefix={<ClockCircleOutlined />}
          valueStyle={{ fontSize: 14 }}
        />
        <Statistic
          title="Throughput"
          value={bottleneck.throughput.toFixed(2)}
          suffix="/s"
          prefix={<ThunderboltOutlined />}
          valueStyle={{ fontSize: 14 }}
        />
        <Statistic
          title="Error Rate"
          value={bottleneck.errorRate.toFixed(3)}
          suffix="%"
          prefix={getScenarioStatsIcon("errorRate")}
          valueStyle={{ fontSize: 14 }}
        />
      </div>

      {bottleneck.analysis && (
        <Alert
          message="AI Analysis"
          description={bottleneck.analysis}
          type="info"
          showIcon
          style={{ marginTop: 8 }}
        />
      )}
    </Card>
  );
}

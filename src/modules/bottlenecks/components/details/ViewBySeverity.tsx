"use client";
import {
  Bottleneck,
  BottleneckRunHistory,
  BottleneckSeverity,
} from "@/bottlenecks/types/bottleneck";
import { Card, Col, Row, Space, Tag } from "antd";
import Text from "antd/es/typography/Text";
import { useMemo } from "react";
import { getSeverityColor, getSeverityIcon } from "../../utils";
import { BottleneckCard } from "./";

interface BottleneckWithContext extends Bottleneck {
  step: { id: string; name: string };
  flow: { id: string; name: string };
}

export default function ViewBySeverity({
  runHistory,
}: {
  runHistory: BottleneckRunHistory;
}) {
  const bottlenecksBySeverity = useMemo(() => {
    if (!runHistory?.scenario?.flows)
      return {} as Record<BottleneckSeverity, BottleneckWithContext[]>;

    const bottlenecks = runHistory.scenario.flows.flatMap((flow) =>
      flow.steps.flatMap((step) =>
        step.bottlenecks.map((bottleneck) => ({
          ...bottleneck,
          step,
          flow,
        })),
      ),
    );

    const initialAcc: Record<BottleneckSeverity, BottleneckWithContext[]> = {
      [BottleneckSeverity.HIGH]: [],
      [BottleneckSeverity.MEDIUM]: [],
      [BottleneckSeverity.LOW]: [],
    };

    return bottlenecks.reduce(
      (
        acc: Record<BottleneckSeverity, BottleneckWithContext[]>,
        bottleneck: BottleneckWithContext,
      ) => {
        acc[bottleneck.severity].push(bottleneck);
        return acc;
      },
      initialAcc,
    );
  }, [runHistory]);

  const sortedSeverities = useMemo(() => {
    const severityOrder = {
      [BottleneckSeverity.HIGH]: 0,
      [BottleneckSeverity.MEDIUM]: 1,
      [BottleneckSeverity.LOW]: 2,
    };
    return Object.keys(bottlenecksBySeverity).sort(
      (a, b) =>
        severityOrder[a as BottleneckSeverity] -
        severityOrder[b as BottleneckSeverity],
    ) as BottleneckSeverity[];
  }, [bottlenecksBySeverity]);

  return (
    <>
      {sortedSeverities.map((severity, index) => (
        <Card key={severity} style={{ marginTop: index === 0 ? 0 : 16 }}>
          <Space style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 16 }}>
              {getSeverityIcon(severity)} {severity} Severity
            </Text>
            <Tag color={getSeverityColor(severity)}>
              {bottlenecksBySeverity[severity].length} bottlenecks
            </Tag>
          </Space>

          <Row gutter={[16, 16]}>
            {bottlenecksBySeverity[severity].map((bottleneck) => (
              <Col span={12} key={bottleneck.id}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <BottleneckCard bottleneck={bottleneck} showFlowStep />
                </Space>
              </Col>
            ))}
          </Row>
        </Card>
      ))}
    </>
  );
}

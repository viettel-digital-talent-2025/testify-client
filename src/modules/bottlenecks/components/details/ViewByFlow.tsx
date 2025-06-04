"use client";

import { BottleneckRunHistory } from "@/bottlenecks/types/bottleneck";
import { Card, Col, Row, Tag } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import { BottleneckCard } from "./";

export default function ViewByFlow({
  runHistory,
}: {
  runHistory: BottleneckRunHistory;
}) {
  return (
    <div className="flex h-full flex-[1] flex-col gap-8 overflow-y-auto">
      {runHistory.scenario.flows.map((flow) => (
        <Card
          key={flow.id}
          title={
            <>
              <Text type="secondary">Flow: </Text>
              <Text>{flow.name}</Text>
            </>
          }
        >
          {flow.steps.map((step, index) => (
            <div key={step.id} className={index > 0 ? "mt-6" : ""}>
              <div className="mb-2 flex items-center gap-2">
                <Text type="secondary">Step {index + 1}:</Text>
                <Text>{step.name}</Text>
                {step.bottlenecks.length > 0 && (
                  <Tag>{step.bottlenecks.length} bottlenecks</Tag>
                )}
              </div>

              {step.bottlenecks.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {step.bottlenecks.map((bottleneck) => (
                    <Col span={8} key={bottleneck.id}>
                      <BottleneckCard bottleneck={bottleneck} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Paragraph type="secondary" style={{ fontSize: 14 }}>
                  No bottlenecks detected in this step
                </Paragraph>
              )}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

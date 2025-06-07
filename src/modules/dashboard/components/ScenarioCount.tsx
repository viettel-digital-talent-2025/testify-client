"use client";
import { useGetScenarioCountQuery } from "@/scenarios/apis/scenarioApi";
import { ScenarioType } from "@/scenarios/types/scenario";
import { getScenarioIconByType } from "@/scenarios/utils";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { useMemo } from "react";

export default function ScenarioCount() {
  const { data, isLoading } = useGetScenarioCountQuery();

  const cards = useMemo(
    () => [
      {
        title: "Total",
        value: (data?.WEB ?? 0) + (data?.API ?? 0),
        type: ScenarioType.USER_FLOW,
      },
      {
        title: "Web",
        value: data?.WEB ?? 0,
        type: ScenarioType.WEB,
      },
      {
        title: "API",
        value: data?.API ?? 0,
        type: ScenarioType.API,
      },
    ],
    [data],
  );

  return (
    <Card>
      <Typography.Title level={5}>Scenario Count</Typography.Title>
      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col key={card.title} span={8}>
            <Card loading={isLoading}>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={getScenarioIconByType({
                  type: card.type,
                  size: "large",
                })}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

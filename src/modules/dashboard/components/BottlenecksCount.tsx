"use client";
import { useGetBottlenecksCountQuery } from "@/bottlenecks/apis/bottlenecksApi";
import { Card, Col, Row, Statistic, Typography } from "antd";

export default function BottlenecksCount() {
  const { data, isLoading } = useGetBottlenecksCountQuery();
  return (
    <Card>
      <Typography.Title level={5}>Bottlenecks Count</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card loading={isLoading}>
            <Statistic
              title="High"
              value={data?.HIGH}
              valueStyle={{ color: "red" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Medium"
              value={data?.MEDIUM}
              valueStyle={{ color: "orange" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={isLoading}>
            <Statistic
              title="Low"
              value={data?.LOW}
              valueStyle={{ color: "green" }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

"use client";
import "@/shared/components/chartjs/config";
import { Line } from "react-chartjs-2";
import { Button, Row, Col, Space, Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { colors } from "@/shared/constants/colors";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

// Sample performance test data
const labels = ["0s", "30s", "1m", "1m30s", "2m", "2m30s", "3m"];
const responseTimeData = [100, 120, 150, 180, 160, 140, 130];
const throughputData = [100, 120, 150, 180, 200, 220, 250];

const chartData = {
  labels,
  datasets: [
    {
      label: "Response Time (ms)",
      data: responseTimeData,
      borderColor: colors.primary,
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Throughput (req/s)",
      data: throughputData,
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
};

export default function HeroSection() {
  return (
    <section
      className="from-background to-muted/50 relative overflow-hidden bg-gradient-to-b px-4 py-20 md:py-32"
      id="hero"
    >
      <div className="mx-auto max-w-7xl">
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={14}>
            <Space direction="vertical" size="large" className="w-full">
              <Space direction="vertical" size="middle">
                <Title className="!text-4xl !font-bold !tracking-tight sm:!text-5xl md:!text-6xl">
                  Intelligent Performance Testing Platform
                </Title>
                <Paragraph className="text-muted-foreground text-xl">
                  Build a complete web platform that enables full automation of
                  the performance testing process, visualizes results, and
                  automatically detects bottlenecks using AI/ML.
                </Paragraph>
              </Space>

              <Space size="middle" wrap>
                <Link href="/login">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                  >
                    Get Started
                  </Button>
                </Link>
                <Button size="large">
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </Space>
            </Space>
          </Col>

          <Col xs={24} md={10}>
            <Card
              hoverable
              style={{ height: "400px" }}
              styles={{ body: { height: "calc(100% - 24px)" } }}
            >
              <Line data={chartData} options={chartOptions} />
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}

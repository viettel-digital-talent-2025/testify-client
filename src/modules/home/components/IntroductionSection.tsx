"use client";

import { Typography, Row, Col, Button, Space } from "antd";
import { RocketOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export function IntroductionSection() {
  return (
    <Row gutter={[32, 32]} align="middle" style={{ minHeight: "80vh" }}>
      <Col xs={24} md={12}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={1}>
            Welcome to VDT 2025
            <RocketOutlined style={{ marginLeft: 16, color: "#1890ff" }} />
          </Title>
          <Paragraph style={{ fontSize: "1.2rem", marginBottom: 32 }}>
            Empowering digital talent through comprehensive training and
            development programs. Join us in shaping the future of digital
            transformation.
          </Paragraph>
          <Space>
            <Button type="primary" size="large">
              Get Started
            </Button>
            <Button size="large">Learn More</Button>
          </Space>
        </Space>
      </Col>
      <Col xs={24} md={12} style={{ textAlign: "center" }}>
        <img
          src="/assets/hero-image.png"
          alt="Digital Talent"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </Col>
    </Row>
  );
}

import Link from "next/link";
import { Button, Row, Col, Space, Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { colors } from "@/modules/shared/constants/colors";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

export default function CTASection() {
  return (
    <section id="cta" className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Card
          className="overflow-hidden border-none"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          <Row gutter={[48, 48]} align="middle" className="p-8 md:p-12">
            <Col xs={24} md={14}>
              <Space direction="vertical" size="large">
                <Title
                  level={2}
                  className="!mb-0 !text-3xl !text-white sm:!text-4xl"
                >
                  Ready to Optimize Your Application&apos;s Performance?
                </Title>
                <Paragraph className="!text-lg !text-white/90">
                  Start your free trial today and see how our platform can help
                  you build faster, more reliable applications.
                </Paragraph>
              </Space>
            </Col>

            <Col xs={24} md={10}>
              <Space direction="vertical" size="middle" className="w-full">
                <Link href="/register" className="w-full">
                  <Button
                    size="large"
                    className="w-full"
                    style={{
                      background: "white",
                      color: colors.primary,
                      border: "none",
                      height: 48,
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button
                    size="large"
                    className="w-full"
                    style={{
                      background: "transparent",
                      color: "white",
                      border: "2px solid white",
                      height: 48,
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                    icon={<ArrowRightOutlined />}
                  >
                    Schedule Demo
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    </section>
  );
}

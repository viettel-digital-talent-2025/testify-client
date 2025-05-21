import { Card, Row, Col } from "antd";
import {
  ThunderboltOutlined,
  BarChartOutlined,
  BulbOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { colors } from "@/modules/shared/constants/colors";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

export default function FeaturesSection() {
  return (
    <section className="px-4 py-20 md:py-32" id="features">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Title level={2}>Powerful Features for Performance Testing</Title>
          <Paragraph>
            Our platform provides everything you need to test, analyze, and
            optimize your application&apos;s performance.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard
              icon={<ThunderboltOutlined style={{ color: colors.primary }} />}
              title="Automated Testing"
              description="Schedule and run automated performance tests. Monitor your application's performance over time."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard
              icon={<BarChartOutlined style={{ color: colors.primary }} />}
              title="Real-time Monitoring"
              description="Track key metrics like response time, throughput, and error rates on real-time dashboards."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard
              icon={<BulbOutlined style={{ color: colors.primary }} />}
              title="AI-Powered Bottleneck Detection"
              description="Our AI automatically identifies performance bottlenecks and suggests optimization measures."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard
              icon={<LineChartOutlined style={{ color: colors.primary }} />}
              title="Comprehensive Reports"
              description="Generate detailed reports with actionable insights to improve your application's performance."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard
              icon={
                <SafetyCertificateOutlined style={{ color: colors.primary }} />
              }
              title="Secure Testing"
              description="Run tests in a secure environment with end-to-end encryption and data protection."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard
              icon={<ApiOutlined style={{ color: colors.primary }} />}
              title="Resource Optimization"
              description="Identify resource usage patterns and optimize CPU, memory, and network utilization."
            />
          </Col>
        </Row>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card
      style={{ height: "100%", boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="text-primary mb-4 text-4xl">{icon}</div>
        <Title level={4}>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </div>
    </Card>
  );
}

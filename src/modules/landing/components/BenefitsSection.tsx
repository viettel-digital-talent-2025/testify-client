import { Row, Col, Timeline, Card } from "antd";
import {
  CheckCircleOutlined,
  PlayCircleOutlined,
  BarChartOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { colors } from "@/modules/shared/constants/colors";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

const benefits = [
  {
    step: 1,
    title: "Create Test Scenarios",
    description:
      "Define test scenarios with our intuitive interface. Specify endpoints, user flows, and test parameters.",
    icon: (
      <CheckCircleOutlined style={{ fontSize: 24, color: colors.primary }} />
    ),
    color: colors.primary,
    bgColor: colors.secondary,
  },
  {
    step: 2,
    title: "Run Automated Tests",
    description:
      "Schedule tests to run automatically or trigger manually. Our platform handles execution and data collection.",
    icon: (
      <PlayCircleOutlined style={{ fontSize: 24, color: colors.primary }} />
    ),
    color: colors.primary,
    bgColor: colors.secondary,
  },
  {
    step: 3,
    title: "Analyze Results",
    description:
      "Review comprehensive reports and visualizations. Our AI highlights bottlenecks and performance issues.",
    icon: <BarChartOutlined style={{ fontSize: 24, color: colors.primary }} />,
    color: colors.primary,
    bgColor: colors.secondary,
  },
  {
    step: 4,
    title: "Optimize Performance",
    description:
      "Implement suggested optimizations and run follow-up tests to verify improvements.",
    icon: <RocketOutlined style={{ fontSize: 24, color: colors.primary }} />,
    color: colors.primary,
    bgColor: colors.secondary,
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="bg-muted/30 px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Title level={2}>Workflow Process</Title>
          <Paragraph>
            Our platform makes performance testing simple, efficient, and
            achievable.
          </Paragraph>
        </div>

        <Row>
          <Col xs={24} md={24}>
            <Timeline
              mode="alternate"
              items={benefits.map((item, index) => {
                const isLeft = index % 2 === 0; // left side of timeline

                return {
                  dot: (
                    <div
                      style={{
                        backgroundColor: item.bgColor,
                        color: item.color,
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: `0 0 10px ${item.color}66`,
                        fontWeight: "bold",
                        fontSize: 16,
                        zIndex: 10, // ensure it's on top
                      }}
                    >
                      {item.icon}
                    </div>
                  ),
                  children: (
                    <Card
                      hoverable
                      style={{
                        borderLeft: isLeft ? `4px solid ${item.color}` : `none`,
                        borderRight: isLeft
                          ? `none`
                          : `4px solid ${item.color}`,
                        boxShadow:
                          "rgba(0, 0, 0, 0.1) 0px 4px 12px, rgba(0, 0, 0, 0.05) 0px 2px 4px",
                        marginBottom: 24,
                        marginLeft: isLeft ? 25 : 0,
                        marginRight: isLeft ? 0 : 25,
                      }}
                    >
                      <Title level={4}>{item.title}</Title>
                      <Paragraph style={{ color: "#555" }}>
                        {item.description}
                      </Paragraph>
                    </Card>
                  ),
                };
              })}
              className="custom-timeline"
            />
          </Col>
        </Row>
      </div>
    </section>
  );
}

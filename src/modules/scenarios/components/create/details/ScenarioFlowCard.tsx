import { Card } from "antd";
import { cloneElement } from "react";
import { colors } from "@/shared/constants/colors";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";

interface ScenarioFlowCardProps {
  icon: React.ReactElement<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function ScenarioFlowCard(props: ScenarioFlowCardProps) {
  const { icon, title, description, isSelected = false, onClick } = props;
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        height: "100%",
        textAlign: "center",
        border: isSelected
          ? `2px solid ${colors.primary}`
          : `1px solid ${colors.border}`,
      }}
    >
      {cloneElement(icon, {
        style: { fontSize: "1.875rem", marginBottom: "0.5rem" },
      })}
      <div>
        <Title level={5}>{title}</Title>
        <Text type="secondary">{description}</Text>
      </div>
    </Card>
  );
}

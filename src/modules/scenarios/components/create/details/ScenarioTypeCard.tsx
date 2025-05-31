import { colors } from "@/shared/constants/colors";
import { Card } from "antd";

interface ScenarioTypeCardProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isSelected: boolean;
}

export default function ScenarioTypeCard(props: ScenarioTypeCardProps) {
  const { icon, label, isSelected, onClick } = props;
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        height: "100%",
        textAlign: "center",
        border: isSelected
          ? `1px solid ${colors.primary}`
          : `1px solid ${colors.border}`,
      }}
      styles={{ body: { padding: "16px" } }}
    >
      <div className="mb-2 text-2xl">{icon}</div>
      <div>{label}</div>
    </Card>
  );
}

import {
  GlobalOutlined,
  ApiOutlined,
  DatabaseOutlined,
  BranchesOutlined,
  ApartmentOutlined,
  OrderedListOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { ScenarioType } from "@/scenarios/types/scenario";

interface ScenarioIconProps {
  size?: "small" | "medium" | "large";
  type: ScenarioType;
}

const mapSize = {
  small: "text-sm",
  medium: "text-lg",
  large: "text-xl",
};

export function getScenarioIconByType(props: ScenarioIconProps) {
  const { size = "small", type } = props;
  switch (type) {
    case ScenarioType.WEB:
      return <GlobalOutlined className={mapSize[size]} />;
    case ScenarioType.API:
      return <ApiOutlined className={mapSize[size]} />;
    case ScenarioType.DATABASE:
      return <DatabaseOutlined className={mapSize[size]} />;
    case ScenarioType.USER_FLOW:
    default:
      return <BranchesOutlined className={mapSize[size]} />;
  }
}

export function getScenarioColorByType(type: ScenarioType) {
  switch (type) {
    case ScenarioType.WEB:
      return "blue";
    case ScenarioType.API:
      return "green";
    case ScenarioType.DATABASE:
      return "purple";
    case ScenarioType.USER_FLOW:
      return "red";
  }
}

export function getScenarioStatsIcon(
  stats: "flows" | "steps" | "vus" | "duration",
) {
  switch (stats) {
    case "flows":
      return <ApartmentOutlined />;
    case "steps":
      return <OrderedListOutlined />;
    case "vus":
      return <UserOutlined />;
    case "duration":
      return <ClockCircleOutlined />;
  }
}

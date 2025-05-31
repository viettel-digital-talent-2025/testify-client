import { ScenarioFlowStepType, ScenarioType } from "@/scenarios/types/scenario";
import {
  ApartmentOutlined,
  ApiOutlined,
  BranchesOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  OrderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

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

interface ScenarioIconStepProps {
  size?: "small" | "medium" | "large";
  type: ScenarioFlowStepType;
}

export function getScenarioIconByStepType(props: ScenarioIconStepProps) {
  const { size = "small", type } = props;
  switch (type) {
    case ScenarioFlowStepType.BROWSER:
      return <GlobalOutlined className={mapSize[size]} />;
    case ScenarioFlowStepType.API:
      return <ApiOutlined className={mapSize[size]} />;
    case ScenarioFlowStepType.WAIT:
      return <ClockCircleOutlined className={mapSize[size]} />;
    case ScenarioFlowStepType.SQL:
      return <DatabaseOutlined className={mapSize[size]} />;
  }
}

export function getScenarioColorByStepType(type: ScenarioFlowStepType) {
  switch (type) {
    case ScenarioFlowStepType.BROWSER:
      return "blue";
    case ScenarioFlowStepType.API:
      return "green";
    case ScenarioFlowStepType.SQL:
      return "purple";
    case ScenarioFlowStepType.WAIT:
      return "orange";
    default:
      return "default";
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

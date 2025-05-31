import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { RunHistoryStatus } from "@/scenarios/types/runHistory";

export const getRunHistoryStatusColor = (
  status: string,
): "success" | "error" | "processing" | "default" => {
  switch (status) {
    case RunHistoryStatus.RUNNING:
      return "processing";
    case RunHistoryStatus.SUCCESS:
      return "success";
    case RunHistoryStatus.FAILED:
      return "error";
    case RunHistoryStatus.ABORTED:
      return "default";
    default:
      return "default";
  }
};

export const getRunHistoryStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case RunHistoryStatus.SUCCESS:
      return <CheckCircleOutlined />;
    case RunHistoryStatus.FAILED:
      return <CloseCircleOutlined />;
    case RunHistoryStatus.RUNNING:
      return <ClockCircleOutlined />;
    default:
      return null;
  }
};

import { RunHistoryStatus } from "../types/runHistory";

export const getProgressStatus = (
  progress: number,
  status: RunHistoryStatus,
) => {
  return status === RunHistoryStatus.RUNNING
    ? "active"
    : progress < 100
      ? "exception"
      : "success";
};

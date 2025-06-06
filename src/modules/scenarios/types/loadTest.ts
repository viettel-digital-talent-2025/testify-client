import { RunHistoryStatus } from "./runHistory";

export interface LoadTestStatusEvent {
  runHistoryId: string;
  scenarioId: string;
  userId: string;
  status: RunHistoryStatus;
  runAt: Date;
  type: string;
  id: string;
  retry: number;
}

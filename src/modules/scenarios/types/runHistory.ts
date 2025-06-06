export enum RunHistoryStatus {
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  ABORTED = "ABORTED",
}

export interface RunHistoryMetric {
  id: string;
  runHistoryId: string;
  flowId: string;
  stepId: string;
  avgLatency: number;
  p95Latency: number;
  throughput: number;
  errorRate: number;
  createdAt: string;
  updatedAt: string;
  flow: {
    id: string;
    name: string;
  };
  step: {
    id: string;
    name: string;
  };
}

export interface RunHistory {
  id: string;
  scenarioId: string;
  runAt: string;
  endAt: string;
  avgLatency: number;
  p95Latency: number;
  throughput: number;
  errorRate: number;
  progress: number;
  status: RunHistoryStatus;
  createdAt: string;
  updatedAt: string;
  scenario: {
    id: string;
    name: string;
  };
  runHistoryMetrics: RunHistoryMetric[];
}

export type RunHistoryOrderBy =
  | "runAt"
  | "avgLatency"
  | "p95Latency"
  | "throughput"
  | "errorRate"
  | "createdAt";

export interface RunHistoryParams {
  search: string;
  skip: number;
  take: number;
  orderBy: RunHistoryOrderBy;
  order: "asc" | "desc";
  status: RunHistoryStatus[];
  startTime: string | null;
  endTime: string | null;
}

export interface GetRunHistoryRequest extends RunHistoryParams {
  scenarioId: string | null;
}

export type RunHistoryWithMetrics = RunHistory;

export interface RunHistoryListResponse {
  data: RunHistoryWithMetrics[];
  total: number;
}

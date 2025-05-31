export enum RunHistoryStatus {
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  ABORTED = "ABORTED",
}

export interface RunHistoryMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
}

export interface RunHistory {
  id: string;
  scenarioId: string;
  scenario: {
    id: string;
    name: string;
  };
  status: RunHistoryStatus;
  startedAt: string;
  endedAt: string | null;
  runAt: string;
  duration: number;
  vus: number;
  avgResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  successRate: number;
  rawResultUrl: string | null;
  metrics: RunHistoryMetrics | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export type RunHistoryOrderBy =
  | "runAt"
  | "vus"
  | "duration"
  | "successRate"
  | "avgResponseTime"
  | "requestsPerSecond"
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

export interface UpdateRunHistoryRequest {
  status?: RunHistoryStatus;
  endedAt?: string | null;
  metrics?: RunHistoryMetrics | null;
}

export interface CreateRunHistoryRequest {
  scenarioId: string;
}

export type RunHistoryWithMetrics = RunHistory;

export interface RunHistoryListResponse {
  data: RunHistoryWithMetrics[];
  total: number;
}

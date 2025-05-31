import { RunHistoryStatus } from "./runHistory";

export interface Metrics {
  key: string;
  metric: string;
  description?: string;
  format?: (value: number) => string;
  calculateDiff?: (current: number, previous: number) => number;
  isBetter?: (diff: number) => boolean;
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | ((value: number) => string)
    | ((current: number, previous: number) => number)
    | ((diff: number) => boolean);
}

export interface RealtimeMetricsQueryParams {
  scenarioId: string;
  runHistoryId?: string;
  duration?: string;
  flowId?: string;
  stepId?: string;
}

export interface RealtimeMetrics {
  latency: {
    timestamp: number;
    value: number;
    flowId?: string;
    stepId?: string;
    flowName?: string;
    stepName?: string;
  }[];
  throughput: {
    timestamp: number;
    value: number;
    flowId?: string;
    stepId?: string;
    flowName?: string;
    stepName?: string;
  }[];
  errorRate: {
    timestamp: number;
    value: number;
    flowId?: string;
    stepId?: string;
    flowName?: string;
    stepName?: string;
  }[];
  lastUpdated: string;
}

export interface RealtimeMetricsResponse {
  scenarioId: string;
  runHistoryId?: string;
  scenarioName?: string;
  duration: string;
  interval: string;
  metrics: RealtimeMetrics;
  runAt: string;
  endAt: string | null;
  progress: number;
  lastUpdated: string;
}

export interface LoadTestMetrics {
  avgResponseTime: number;
  errorRate: number;
  successRate: number;
  requestsPerSecond: number;
}

// Base interface for common fields
interface BaseLoadTestStatus {
  scenarioId: string;
  runHistoryId: string;
  status: RunHistoryStatus;
}

// Interface for RUNNING state
interface RunningLoadTestStatus extends BaseLoadTestStatus {
  status: RunHistoryStatus.RUNNING;
  metrics?: never;
}

// Interface for completed states (SUCCESS, FAILED, ABORTED)
interface CompletedLoadTestStatus extends BaseLoadTestStatus {
  status: RunHistoryStatus;
  metrics: LoadTestMetrics;
}

// Union type for all possible states
export type LoadTestStatus = (
  | RunningLoadTestStatus
  | CompletedLoadTestStatus
) & {
  isRunning: boolean;
};

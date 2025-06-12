import { RunHistory } from "@/scenarios/types/runHistory";
import { Scenario } from "@/scenarios/types/scenario";

export enum BottleneckSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum BottleneckSource {
  LATENCY = "LATENCY",
  THROUGHPUT = "THROUGHPUT",
  ERROR_RATE = "ERROR_RATE",
}

export interface Bottleneck {
  id: string;
  userId: string;
  scenarioId: string;
  runHistoryId: string;
  flowId: string;
  stepId: string;
  severity: BottleneckSeverity;
  source: BottleneckSource[];
  timestamp: Date;
  avgLatency: number;
  p95Latency: number;
  throughput: number;
  errorRate: number;
  alertAt: Date | null;
  isRead: boolean;
  analysis: string | null;
  user: { id: string; email: string };
  scenario: { id: string; name: string };
  flow: { id: string; name: string };
  step: { id: string; name: string };
}

export interface BottleneckPoint {
  id: string;
  timestamp: number;
  severity: BottleneckSeverity;
  source: BottleneckSource[];
  p95Latency: number;
  avgLatency: number;
  throughput: number;
  errorRate: number;
  analysis: string | null;
}

export interface BottlenecksGroup extends RunHistory {
  countBottlenecks: number;
  countLow: number;
  countMedium: number;
  countHigh: number;
}

export interface BottleneckRunHistory extends RunHistory {
  scenario: Scenario;
}

export interface BottlenecksCount {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
}

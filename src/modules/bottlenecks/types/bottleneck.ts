import { RunHistory } from "@/scenarios/types/runHistory";
import { Scenario } from "@/scenarios/types/scenario";

export enum BottleneckSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Bottleneck {
  id: string;
  userId: string;
  scenarioId: string;
  runHistoryId: string;
  flowId: string;
  stepId: string;
  severity: BottleneckSeverity;
  timestamp: Date;
  latency: number;
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

export interface BottlenecksGroup extends RunHistory {
  countBottlenecks: number;
}

export interface BottleneckRunHistory extends RunHistory {
  scenario: Scenario;
}

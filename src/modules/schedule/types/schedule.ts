import { Scenario } from "@/scenarios/types/scenario";

export interface CronConfig {
  type:
    | "every_day"
    | "every_x_hours"
    | "every_weekday"
    | "every_weekend"
    | "every_monday"
    | "monthly_day"
    | "once";
  time?: string;
  day?: number;
  hours?: number;
  date?: string;
}

export interface Schedule {
  id: string;
  timeStart?: string;
  timeEnd?: string;
  cronExpression: string;
  timezone: string;
  config?: CronConfig;
  isActive: boolean;
  scenario: Scenario;
}

export interface UpcomingTestsProps {
  tests: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => Promise<void>;
  onSchedule: () => void;
  isLoading?: boolean;
}

export interface CreateScheduleRequest {
  scenarioId: string;
  timezone: string;
  timeStart?: string;
  timeEnd?: string;
  config: CronConfig;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  id: string;
}

export interface ScheduleResponse {
  message: string;
  scheduler: Schedule;
}

export interface SchedulersResponse {
  schedulers: Schedule[];
}

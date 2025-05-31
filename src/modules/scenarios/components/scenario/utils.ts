import { colors } from "@/shared/constants/colors";
import dayjs from "dayjs";

export interface ChartItem {
  timestamp: string | number;
  value?: number;
  avg?: number;
  p95?: number;
  "req/s"?: number;
}

export const formatTime = (timestamp: string | number) => {
  return dayjs(timestamp).format("HH:mm:ss");
};

export const createChartData = (
  data: ChartItem[],
  label: string,
  color: string,
  valueKey: "value" | "avg" | "p95" = "value",
) => {
  if (valueKey === "avg" && data[0]?.p95 !== undefined) {
    return {
      labels: data.map((d) => formatTime(d.timestamp)),
      datasets: [
        {
          label: "Average Latency",
          data: data.map((d) => d.avg ?? 0),
          borderColor: color,
          backgroundColor: color,
          tension: 0.4,
          fill: false,
          borderWidth: 1,
          pointRadius: 2,
        },
        {
          label: "P95 Latency",
          data: data.map((d) => d.p95 ?? 0),
          borderColor: colors.orange,
          backgroundColor: colors.orange,
          tension: 0.4,
          fill: false,
          borderDash: [5, 5],
          borderWidth: 1,
          pointRadius: 2,
        },
      ],
    };
  }

  return {
    labels: data.map((d) => formatTime(d.timestamp)),
    datasets: [
      {
        label,
        data: data.map((d) => d[valueKey] ?? 0),
        borderColor: color,
        backgroundColor: color,
        tension: 0.4,
        fill: false,
        borderWidth: 1,
        pointRadius: 2,
      },
    ],
  };
};

export const createChartOptions = (yAxisLabel: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: (items: { dataIndex: number; label: string }[]) => {
          return items[0].label;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Time",
      },
    },
    y: {
      title: {
        display: true,
        text: yAxisLabel,
      },
      min: 0,
    },
  },
});

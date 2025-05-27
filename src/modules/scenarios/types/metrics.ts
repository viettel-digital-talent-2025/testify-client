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

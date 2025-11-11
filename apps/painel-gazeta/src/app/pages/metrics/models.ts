export interface DateRange {
  start: Date;
  end: Date;
}

export type Granularity = 'hour' | 'day';

export interface KpiMetric {
  label: string;
  value: number;
  deltaPercent?: number;
}

export interface TimeSeriesPoint {
  date: Date;
  value: number;
}

export interface TopNewsItem {
  title: string;
  slug: string;
  views: number;
  lastAccess: Date;
}

export interface LogEvent {
  timestamp: Date;
  user: string;
  action: string;
  detail?: string;
}

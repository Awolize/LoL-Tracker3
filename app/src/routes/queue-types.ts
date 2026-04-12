export interface MetricStats {
	avg: number;
	high: number;
	low: number;
}

export interface QueueDataSummary {
	ts: number;
	waiting: MetricStats;
	active: MetricStats;
	delayed: MetricStats;
	prioritized: MetricStats;
	completed: MetricStats;
	failed: MetricStats;
	latency: MetricStats;
}

export type MetricKey = keyof Omit<QueueDataSummary, "ts">;

// routes/queue/dashboard.tsx

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import * as React from "react";

import { getQueueMetricsFn } from "~/server/jobs/mutations";

import type { MetricKey, MetricStats, QueueDataSummary } from "./queue-types";

// ----------------------------------------------------------------------
// 1. Domain Types
// ----------------------------------------------------------------------

interface QueueMetrics {
	counts: Record<string, number | undefined>;
	workers: Array<Record<string, string>>;
	latencyMsAvg: number;
}

// ----------------------------------------------------------------------
// 2. Utilities (Pure Functions)
// ----------------------------------------------------------------------

const createStats = (val: number): MetricStats => ({
	avg: val,
	high: val,
	low: val,
});

function transformMetricsToSummary(metrics: QueueMetrics): QueueDataSummary {
	return {
		ts: Date.now(),
		waiting: createStats(metrics.counts.waiting ?? 0),
		active: createStats(metrics.counts.active ?? 0),
		delayed: createStats(metrics.counts.delayed ?? 0),
		prioritized: createStats(metrics.counts.prioritized ?? 0),
		completed: createStats(metrics.counts.completed ?? 0),
		failed: createStats(metrics.counts.failed ?? 0),
		latency: createStats(metrics.latencyMsAvg),
	};
}

function mergeSummaries(points: QueueDataSummary[]): QueueDataSummary {
	if (points.length === 0) throw new Error("Cannot merge empty summaries");

	const keys: MetricKey[] = [
		"waiting",
		"active",
		"delayed",
		"prioritized",
		"completed",
		"failed",
		"latency",
	];

	const result = { ts: points[points.length - 1].ts } as QueueDataSummary;

	keys.forEach((key) => {
		const values = points.map((p) => p[key]);
		const avg = values.reduce((sum, curr) => sum + curr.avg, 0) / values.length;
		const high = Math.max(...values.map((v) => v.high));
		const low = Math.min(...values.map((v) => v.low));
		result[key] = { avg, high, low };
	});

	return result;
}

// ----------------------------------------------------------------------
// 3. Custom Hooks (Logic Layer)
// ----------------------------------------------------------------------

/**
 * Manages the timeline history including the downsampling/bucketing logic.
 */
function useQueueHistory() {
	const [history, setHistory] = React.useState<QueueDataSummary[]>([]);

	const addSummary = React.useCallback((summary: QueueDataSummary) => {
		setHistory((prev) => {
			// Create a shallow copy to maintain immutability
			const newHistory = [...prev, summary];
			const now = Date.now();
			const ONE_HOUR = 60 * 60 * 1000;

			// 1. High-res: Last 3 hours
			// 2. Mid-res: 3-24 hours
			// 3. Long-res: > 24 hours

			// For the sake of this refactor, we will stick to the original mutation logic
			// but wrap it safely, as rewriting the algorithm entirely might change behavior
			// the user relies on.

			const highResStart = now - 3 * ONE_HOUR;
			const midResStart = now - 24 * ONE_HOUR;

			// -- High Res Optimization --
			const highRes = newHistory.filter((h) => h.ts >= highResStart);
			if (highRes.length > 500) {
				const extra = highRes.length - 500;
				// Merge the oldest 'extra' points of this segment
				const toMerge = highRes.slice(0, extra + 1);
				const merged = mergeSummaries(toMerge);
				// Replace them in the main array
				const firstIndex = newHistory.indexOf(toMerge[0]);
				if (firstIndex !== -1) {
					newHistory.splice(firstIndex, toMerge.length, merged);
				}
			}

			// -- Mid Res Optimization --
			const midRes = newHistory.filter((h) => h.ts >= midResStart && h.ts < highResStart);
			if (midRes.length > 100) {
				const step = Math.ceil(midRes.length / 100);
				const mergedMid: QueueDataSummary[] = [];
				for (let i = 0; i < midRes.length; i += step) {
					mergedMid.push(mergeSummaries(midRes.slice(i, i + step)));
				}
				const startIdx = newHistory.indexOf(midRes[0]);
				if (startIdx >= 0) newHistory.splice(startIdx, midRes.length, ...mergedMid);
			}

			// -- Long Res Optimization --
			const longRes = newHistory.filter((h) => h.ts < midResStart);
			if (longRes.length > 10) {
				const step = Math.ceil(longRes.length / 10);
				const mergedLong: QueueDataSummary[] = [];
				for (let i = 0; i < longRes.length; i += step) {
					mergedLong.push(mergeSummaries(longRes.slice(i, i + step)));
				}
				const startIdx = newHistory.indexOf(longRes[0]);
				if (startIdx >= 0) newHistory.splice(startIdx, longRes.length, ...mergedLong);
			}

			return newHistory;
		});
	}, []);

	return { history, addSummary };
}

function useQueueMetrics() {
	return useQuery({
		queryKey: ["queue-metrics"],
		queryFn: getQueueMetricsFn,
		refetchInterval: 2000,
		// Keep data fresh, prevent garbage collection immediately if switching tabs
		staleTime: 1000,
	});
}

const LazyMetricChart = React.lazy(() => import("./queue-nivo-charts"));

// ----------------------------------------------------------------------
// 4. UI Components
// ----------------------------------------------------------------------

export const Route = createFileRoute("/queue")({
	component: QueueDashboard,
});

function QueueDashboard() {
	const { history, addSummary } = useQueueHistory();
	const { data: metrics, isError } = useQueueMetrics();

	// Sync effect: When we get new metrics, add to history
	React.useEffect(() => {
		if (metrics) {
			addSummary(transformMetricsToSummary(metrics));
		}
	}, [metrics, addSummary]);

	return (
		<div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-8">
			<header className="mb-8 flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight text-white">
						Queue Dashboard
					</h2>
					<p className="text-neutral-400 mt-1">Real-time job processing metrics</p>
				</div>
				<StatusBadge active={!isError && !!metrics} />
			</header>

			<React.Suspense
				fallback={
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{Array.from({ length: 6 }, (_, i) => (
							<div
								key={i}
								className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 h-80 animate-pulse"
							/>
						))}
					</div>
				}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					<ChartCard title="Active Jobs" color="#3b82f6">
						<LazyMetricChart data={history} metric="active" color="#3b82f6" />
					</ChartCard>

					<ChartCard title="Waiting Jobs" color="#eab308">
						<LazyMetricChart data={history} metric="waiting" color="#eab308" />
					</ChartCard>

					<ChartCard title="Delayed Jobs" color="#a855f7">
						<LazyMetricChart data={history} metric="delayed" color="#a855f7" />
					</ChartCard>

					<ChartCard title="Prioritized Jobs" color="#10b981">
						<LazyMetricChart data={history} metric="prioritized" color="#10b981" />
					</ChartCard>

					<ChartCard title="Failed Jobs" color="#ef4444">
						<LazyMetricChart data={history} metric="failed" color="#ef4444" />
					</ChartCard>

					<ChartCard title="Avg Latency (ms)" color="#f97316">
						<LazyMetricChart data={history} metric="latency" color="#f97316" />
					</ChartCard>
				</div>
			</React.Suspense>
		</div>
	);
}

// --- Sub Components ---

function StatusBadge({ active }: { active: boolean }) {
	return (
		<div
			className={clsx(
				"flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
				active
					? "bg-green-500/10 border-green-500/20 text-green-400"
					: "bg-red-500/10 border-red-500/20 text-red-400",
			)}
		>
			<span className={clsx("relative flex h-2 w-2")}>
				{active && (
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
				)}
				<span
					className={clsx(
						"relative inline-flex rounded-full h-2 w-2",
						active ? "bg-green-500" : "bg-red-500",
					)}
				></span>
			</span>
			{active ? "Live Updates" : "Disconnected"}
		</div>
	);
}

function ChartCard({
	title,
	color,
	children,
}: {
	title: string;
	color: string;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 shadow-sm backdrop-blur-sm">
			<h2 className="text-sm font-medium text-neutral-400 mb-4 flex items-center gap-2">
				<span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
				{title}
			</h2>
			<div className="h-64 w-full">{children}</div>
		</div>
	);
}

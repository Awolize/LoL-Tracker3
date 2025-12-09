// routes/queue/dashboard.tsx

import { type PointTooltipProps, ResponsiveLine, type Serie } from "@nivo/line";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx"; // Assuming you have clsx or cn utility
import * as React from "react";
import { getQueueMetricsFn } from "@/server/jobs/mutations";

// ----------------------------------------------------------------------
// 1. Domain Types
// ----------------------------------------------------------------------

interface QueueMetrics {
	counts: Record<string, number | undefined>;
	workers: Array<Record<string, string>>;
	latencyMsAvg: number;
}

interface MetricStats {
	avg: number;
	high: number;
	low: number;
}

interface QueueDataSummary {
	ts: number;
	waiting: MetricStats;
	active: MetricStats;
	delayed: MetricStats;
	prioritized: MetricStats;
	completed: MetricStats;
	failed: MetricStats;
	latency: MetricStats;
}

type MetricKey = keyof Omit<QueueDataSummary, "ts">;

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

			// Helper to process segments
			const _processSegment = (
				data: QueueDataSummary[],
				cutoff: number,
				_maxPoints: number,
			) => {
				const _segment = data.filter((h) => h.ts < cutoff);
				// If we have data older than this cutoff that isn't merged yet...
				// Note: This logic simplifies the original imperative splice logic
				// by returning a processed array.
				// For strict adherence to the original aggressive bucketing:

				// ... (The original logic modified the array in place based on filters.
				// Below is a cleaner implementation of the same "Keep X points" strategy).
			};

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
			const midRes = newHistory.filter(
				(h) => h.ts >= midResStart && h.ts < highResStart,
			);
			if (midRes.length > 100) {
				const step = Math.ceil(midRes.length / 100);
				const mergedMid: QueueDataSummary[] = [];
				for (let i = 0; i < midRes.length; i += step) {
					mergedMid.push(mergeSummaries(midRes.slice(i, i + step)));
				}
				const startIdx = newHistory.indexOf(midRes[0]);
				if (startIdx >= 0)
					newHistory.splice(startIdx, midRes.length, ...mergedMid);
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
				if (startIdx >= 0)
					newHistory.splice(startIdx, longRes.length, ...mergedLong);
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
					<h1 className="text-3xl font-bold tracking-tight text-white">
						Queue Dashboard
					</h1>
					<p className="text-neutral-400 mt-1">
						Real-time job processing metrics
					</p>
				</div>
				<StatusBadge active={!isError && !!metrics} />
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				<ChartCard title="Active Jobs" color="#3b82f6">
					<MetricChart data={history} metric="active" color="#3b82f6" />
				</ChartCard>

				<ChartCard title="Waiting Jobs" color="#eab308">
					<MetricChart data={history} metric="waiting" color="#eab308" />
				</ChartCard>

				<ChartCard title="Delayed Jobs" color="#a855f7">
					<MetricChart data={history} metric="delayed" color="#a855f7" />
				</ChartCard>

				<ChartCard title="Prioritized Jobs" color="#10b981">
					<MetricChart data={history} metric="prioritized" color="#10b981" />
				</ChartCard>

				<ChartCard title="Failed Jobs" color="#ef4444">
					<MetricChart data={history} metric="failed" color="#ef4444" />
				</ChartCard>

				<ChartCard title="Avg Latency (ms)" color="#f97316">
					<MetricChart data={history} metric="latency" color="#f97316" />
				</ChartCard>
			</div>
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
				<span
					className="w-2 h-2 rounded-full"
					style={{ backgroundColor: color }}
				/>
				{title}
			</h2>
			<div className="h-64 w-full">{children}</div>
		</div>
	);
}

interface MetricChartProps {
	data: QueueDataSummary[];
	metric: MetricKey;
	color: string;
}

const MetricChart = React.memo(({ data, metric, color }: MetricChartProps) => {
	const chartData: Serie[] = React.useMemo(
		() => [
			{
				id: metric,
				color: color,
				data: data.map((point) => ({
					x: point.ts,
					y: point[metric].avg,
					ctx: point[metric],
				})),
			},
		],
		[data, metric, color],
	);

	return (
		<ResponsiveLine
			data={chartData}
			// 1. INCREASED MARGINS: vital for showing axis labels
			margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
			xScale={{
				type: "time",
				format: "%Q",
				useUTC: false,
				precision: "second",
			}}
			xFormat="time:%H:%M:%S"
			yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
			axisTop={null}
			axisRight={null}
			// 2. CONFIGURED AXES
			axisBottom={{
				format: "%H:%M",
				tickValues: 5, // Auto-selects ~5 timestamps
				tickSize: 5, // Small line indicating the exact point
				tickPadding: 10,
				tickRotation: 0,
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 10,
				tickRotation: 0,
				tickValues: 5, // Auto-selects ~5 value steps
			}}
			enableGridX={false}
			enableGridY={true}
			colors={[color]}
			lineWidth={2}
			pointSize={0}
			useMesh={true}
			// 3. UPDATED THEME FOR CONTRAST
			theme={{
				background: "transparent",
				text: {
					fill: "#a3a3a3", // Lighter gray text (neutral-400)
					fontSize: 11,
					fontFamily: "inherit",
				},
				axis: {
					domain: {
						line: {
							stroke: "#525252", // Visible axis line
							strokeWidth: 1,
						},
					},
					ticks: {
						line: {
							stroke: "#525252", // Visible tick marks
							strokeWidth: 1,
						},
						text: {
							fill: "#a3a3a3", // Ensures tick labels are visible
						},
					},
				},
				grid: {
					line: {
						stroke: "#262626",
						strokeWidth: 1,
						strokeDasharray: "4 4",
					},
				},
				crosshair: {
					line: { stroke: "#fff", strokeWidth: 1, strokeOpacity: 0.5 },
				},
				tooltip: {
					container: {
						color: "#000", // Resets text color inside tooltip to black if needed, or use custom tooltip component
					},
				},
			}}
			tooltip={CustomTooltip}
		/>
	);
});

const CustomTooltip = ({ point }: PointTooltipProps) => {
	const metricStats = (point.data as any).ctx as MetricStats; // Access the context we passed

	return (
		<div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 shadow-xl text-xs">
			<div className="mb-2 text-neutral-400">{point.data.xFormatted}</div>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 font-semibold text-white">
					<span
						className="block h-2 w-2 rounded-full"
						style={{ backgroundColor: point.serieColor }}
					/>
					Average: {metricStats.avg.toLocaleString()}
				</div>
				<div className="flex gap-3 text-neutral-500 mt-1 pt-1 border-t border-neutral-800">
					<span>High: {metricStats.high.toLocaleString()}</span>
					<span>Low: {metricStats.low.toLocaleString()}</span>
				</div>
			</div>
		</div>
	);
};

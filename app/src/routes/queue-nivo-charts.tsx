import { type PointTooltipProps, ResponsiveLine } from "@nivo/line";
import * as React from "react";

import type { MetricKey, MetricStats, QueueDataSummary } from "./queue-types";

export interface MetricChartProps {
	data: QueueDataSummary[];
	metric: MetricKey;
	color: string;
}

const MetricChartImpl = ({ data, metric, color }: MetricChartProps) => {
	const chartData = React.useMemo(
		() => [
			{
				id: metric,
				color,
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
			axisBottom={{
				format: "%H:%M",
				tickValues: 5,
				tickSize: 5,
				tickPadding: 10,
				tickRotation: 0,
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 10,
				tickRotation: 0,
				tickValues: 5,
			}}
			enableGridX={false}
			enableGridY={true}
			colors={[color]}
			lineWidth={2}
			pointSize={0}
			useMesh={true}
			theme={{
				background: "transparent",
				text: {
					fill: "#a3a3a3",
					fontSize: 11,
					fontFamily: "inherit",
				},
				axis: {
					domain: {
						line: {
							stroke: "#525252",
							strokeWidth: 1,
						},
					},
					ticks: {
						line: {
							stroke: "#525252",
							strokeWidth: 1,
						},
						text: {
							fill: "#a3a3a3",
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
						color: "#000",
					},
				},
			}}
			tooltip={CustomTooltip}
		/>
	);
};

export const MetricChart = React.memo(MetricChartImpl);

const CustomTooltip = ({ point }: PointTooltipProps) => {
	const metricStats = (point.data as { ctx?: MetricStats }).ctx;
	if (!metricStats) return null;

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

export default MetricChart;

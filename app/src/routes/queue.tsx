// routes/queue/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getQueueMetricsFn } from "@/server/jobs/mutations";

interface QueueMetrics {
  counts: { [key: string]: number | undefined };
  workers: Array<{ [key: string]: string }>;
  latencyMsAvg: number;
}

interface QueueDataSummary {
  ts: number;
  waiting: { avg: number; high: number; low: number };
  active: { avg: number; high: number; low: number };
  delayed: { avg: number; high: number; low: number };
  prioritized: { avg: number; high: number; low: number };
  completed: { avg: number; high: number; low: number };
  failed: { avg: number; high: number; low: number };
  latency: { avg: number; high: number; low: number };
}

const history: QueueDataSummary[] = [];

function createSummary(metrics: QueueMetrics): QueueDataSummary {
  const summarize = (key: keyof QueueMetrics['counts'] | 'latencyMsAvg') => {
    const value = key === 'latencyMsAvg' ? metrics.latencyMsAvg : metrics.counts[key] || 0;
    return { avg: value, high: value, low: value };
  };

  return {
    ts: Date.now(),
    waiting: summarize('waiting'),
    active: summarize('active'),
    delayed: summarize('delayed'),
    prioritized: summarize('prioritized'),
    completed: summarize('completed'),
    failed: summarize('failed'),
    latency: summarize('latencyMsAvg'),
  };
}

function mergeSummaries(points: QueueDataSummary[]): QueueDataSummary {
  const combine = (key: keyof QueueDataSummary) => {
    const values = points.map(p => p[key] as any);
    const avg = values.reduce((a, b) => a + b.avg, 0) / values.length;
    const high = Math.max(...values.map(v => v.high));
    const low = Math.min(...values.map(v => v.low));
    return { avg, high, low };
  };

  return {
    ts: points[points.length - 1].ts,
    waiting: combine('waiting'),
    active: combine('active'),
    delayed: combine('delayed'),
    prioritized: combine('prioritized'),
    completed: combine('completed'),
    failed: combine('failed'),
    latency: combine('latency'),
  };
}


export const Route = createFileRoute("/queue")({
  component: QueueDashboard,
});

function QueueDashboard() {
  const [history, setHistory] = React.useState<QueueDataSummary[]>([]);
  
  const addSummary = (summary: QueueDataSummary) => {
    setHistory(prev => {
      const newHistory = [...prev, summary];
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      // High-res: last 3 hours → keep 500 points
      const highRes = newHistory.filter(h => h.ts >= now - 3 * oneHour);
      if (highRes.length > 500) {
        const extra = highRes.length - 500;
        const merged = mergeSummaries(highRes.slice(0, extra + 1));
        newHistory.splice(newHistory.indexOf(highRes[0]), extra + 1, merged);
      }

      // Mid-res: 3–24 hours → keep 100 points
      const midRes = newHistory.filter(h => h.ts >= now - 24 * oneHour && h.ts < now - 3 * oneHour);
      if (midRes.length > 100) {
        const step = Math.ceil(midRes.length / 100);
        const mergedMid: QueueDataSummary[] = [];
        for (let i = 0; i < midRes.length; i += step) {
          mergedMid.push(mergeSummaries(midRes.slice(i, i + step)));
        }
        const startIdx = newHistory.indexOf(midRes[0]);
        if (startIdx >= 0) newHistory.splice(startIdx, midRes.length, ...mergedMid);
      }

      // Long-term: older than 24 hours → keep 10 points
      const longRes = newHistory.filter(h => h.ts < now - 24 * oneHour);
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
  };

  const { data: metrics } = useQuery({
    queryKey: ['queue-metrics'],
    queryFn: () => getQueueMetricsFn(),
    refetchInterval: 2000,
  });

  React.useEffect(() => {
    if (!metrics) return;
    const summary = createSummary(metrics);
    addSummary(summary);
  }, [metrics]);

  return (
    <div className="p-6 flex flex-col gap-10">
      <h1 className="text-2xl font-semibold">Queue Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        <Chart title="Active Jobs" data={history} keyProp="active" />
        <Chart title="Delayed Jobs" data={history} keyProp="delayed" />
        <Chart title="Prioritized Jobs" data={history} keyProp="prioritized" />
        <Chart title="Failed Jobs" data={history} keyProp="failed" />
        <Chart title="Latency (ms)" data={history} keyProp="latency" />
      </div>
    </div>
  );
}

function Chart({
  title,
  data,
  keyProp,
}: {
  title: string;
  data: QueueDataSummary[];
  keyProp: keyof QueueDataSummary;
}) {
  return (
    <div className="h-64 w-full rounded-xl bg-neutral-800 p-4">
      <h2 className="mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={(d: any) => d[keyProp].avg}
            stroke="#fff"
            dot={false}
          />
          <CartesianGrid stroke="#333" />
          <XAxis
            dataKey="ts"
            tickFormatter={(t) => new Date(t).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#ffffff',
            }}
            labelStyle={{ color: '#ffffff' }}
            formatter={(value: number, name: string, props: any) => {
              const point = props.payload[keyProp];
              return `${value} (H:${point.high} L:${point.low})`;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// server/jobs/mutations.ts
import { createServerFn } from "@tanstack/react-start";
import { getQueueMetrics } from "./metrics";

export const getQueueMetricsFn = createServerFn({ method: "GET" }).handler(
  async () => getQueueMetrics(),
);

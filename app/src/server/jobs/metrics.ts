// server/queue-metrics.ts
import { updateQueue } from './queue';

export interface QueueMetrics {
  counts: {
    waiting?: number;
    active?: number;
    delayed?: number;
    prioritized?: number;
    completed?: number;
    failed?: number;
    paused?: number;
    'waiting-children'?: number;
  };
  workers: Array<{ [key: string]: string }>;
  latencyMsAvg: number;
}

/**
 * Get current queue metrics for dashboard
 */
export async function getQueueMetrics(): Promise<QueueMetrics> {
  try {
    // Get counts of jobs in various states
    const counts = await updateQueue.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
      'paused',
      'prioritized',
      'waiting-children'
    );

    // Get some active jobs to calculate latency
    const activeJobs = await updateQueue.getJobs(['active'], 0, 10);
    const latencySamples = activeJobs.map(j => Date.now() - j.timestamp);

    // Get worker information
    const workers = await updateQueue.getWorkers();

    return {
      counts,
      workers,
      latencyMsAvg: latencySamples.length
        ? latencySamples.reduce((a, b) => a + b, 0) / latencySamples.length
        : 0,
    };
  } catch (error) {
    console.error('Error getting queue metrics:', error);
    return {
      counts: {},
      workers: [],
      latencyMsAvg: 0,
    };
  }
}

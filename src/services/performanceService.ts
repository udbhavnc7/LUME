import { PerformanceMetrics } from '../types';

const metricsStore: Partial<PerformanceMetrics> = {};
const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export function startTimer(label: string): () => number {
  const start = performance.now();
  return () => {
    const duration = Math.round(performance.now() - start);
    if (isDev) {
      console.log(`[LUME PERF] ${label}: ${duration}ms`);
    }
    return duration;
  };
}

export function recordMetric<K extends keyof PerformanceMetrics>(
  key: K,
  value: PerformanceMetrics[K]
): void {
  metricsStore[key] = value;
  if (isDev) {
    console.log(`[LUME PERF] ${key}: ${value}ms`);
  }
}

export function getMetrics(): PerformanceMetrics {
  return {
    initialDashboardRender: metricsStore.initialDashboardRender || 0,
    projectRoomLoad: metricsStore.projectRoomLoad || 0,
    predictionCalculation: metricsStore.predictionCalculation || 0,
    datasetImport: metricsStore.datasetImport || 0,
    validationDuration: metricsStore.validationDuration || 0,
    reconciliationDuration: metricsStore.reconciliationDuration || 0,
    precedentRetrieval: metricsStore.precedentRetrieval || 0,
    gisFiltering: metricsStore.gisFiltering || 0,
    actionQueueCalculation: metricsStore.actionQueueCalculation || 0,
  };
}

export function clearMetrics(): void {
  Object.keys(metricsStore).forEach(key => {
    delete metricsStore[key as keyof PerformanceMetrics];
  });
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

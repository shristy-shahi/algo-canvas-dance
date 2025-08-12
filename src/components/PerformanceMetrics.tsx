import React from 'react';
import { SortingState } from '@/components/SortingVisualizer';

interface PerformanceMetricsProps {
  metrics: SortingState;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
      <div className="metric-card">
        <div className="metric-value">{metrics.comparisons.toLocaleString()}</div>
        <div className="metric-label">Comparisons</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-value">{metrics.swaps.toLocaleString()}</div>
        <div className="metric-label">Swaps</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-value">{metrics.arrayAccesses.toLocaleString()}</div>
        <div className="metric-label">Array Accesses</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-value">{formatTime(metrics.timeElapsed)}</div>
        <div className="metric-label">Time Elapsed</div>
      </div>
    </div>
  );
};
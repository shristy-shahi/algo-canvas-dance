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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const metricsData = [
    {
      value: formatNumber(metrics.comparisons),
      label: 'Comparisons',
      icon: '⚡',
      color: 'from-algo-blue to-algo-cyan'
    },
    {
      value: formatNumber(metrics.swaps),
      label: 'Swaps',
      icon: '🔄',
      color: 'from-algo-orange to-algo-red'
    },
    {
      value: formatNumber(metrics.arrayAccesses),
      label: 'Array Accesses',
      icon: '📊',
      color: 'from-algo-purple to-algo-blue'
    },
    {
      value: formatTime(metrics.timeElapsed),
      label: 'Time Elapsed',
      icon: '⏱️',
      color: 'from-algo-green to-algo-cyan'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => (
        <div 
          key={metric.label}
          className="metric-card group animate-entrance"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Icon */}
          <div className="text-2xl mb-2 group-hover:animate-bounce">
            {metric.icon}
          </div>
          
          {/* Value */}
          <div className={`metric-value bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
            {metric.value}
          </div>
          
          {/* Label */}
          <div className="metric-label mt-1">
            {metric.label}
          </div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 pointer-events-none">
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${metric.color} 
                           opacity-20 blur-sm animate-pulse-glow`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};
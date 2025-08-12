import React from 'react';
import { cn } from '@/lib/utils';

interface ArrayBarProps {
  value: number;
  maxValue: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
  width: number;
}

export const ArrayBar: React.FC<ArrayBarProps> = ({ value, maxValue, state, width }) => {
  const height = Math.max(8, (value / maxValue) * 350); // Min height of 8px, max ~350px

  return (
    <div
      className={cn(
        'vis-bar relative origin-bottom',
        {
          'comparing': state === 'comparing',
          'swapping': state === 'swapping',
          'sorted': state === 'sorted',
          'pivot': state === 'pivot'
        }
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minHeight: '8px'
      }}
    >
      {/* Value display on hover */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                      bg-popover text-popover-foreground px-2 py-1 rounded text-xs 
                      opacity-0 hover:opacity-100 transition-opacity duration-200
                      pointer-events-none z-10 font-mono">
        {value}
      </div>
    </div>
  );
};
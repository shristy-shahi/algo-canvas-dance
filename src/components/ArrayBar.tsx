import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ArrayBarProps {
  value: number;
  maxValue: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
  width: number;
}

export const ArrayBar: React.FC<ArrayBarProps> = ({ value, maxValue, state, width }) => {
  const [isVisible, setIsVisible] = useState(false);
  const height = Math.max(8, (value / maxValue) * 350);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.random() * 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center group">
      {/* Enhanced value tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                      bg-popover/95 text-popover-foreground px-3 py-1.5 rounded-lg text-sm 
                      opacity-0 group-hover:opacity-100 transition-all duration-300
                      pointer-events-none z-20 font-mono font-medium
                      backdrop-blur-sm border border-border/50 shadow-lg
                      group-hover:translate-y-1">
        {value}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                        border-l-4 border-r-4 border-t-4 border-transparent border-t-popover/95"></div>
      </div>

      {/* Enhanced bar with animations */}
      <div
        className={cn(
          'vis-bar relative transition-all duration-500 ease-out',
          {
            'comparing': state === 'comparing',
            'swapping': state === 'swapping',
            'sorted': state === 'sorted',
            'pivot': state === 'pivot',
            'animate-bar-grow': isVisible && state === 'default',
            'animate-entrance': isVisible
          }
        )}
        style={{
          width: `${width}px`,
          height: isVisible ? `${height}px` : '0px',
          minHeight: isVisible ? '8px' : '0px',
          animationDelay: `${Math.random() * 100}ms`
        }}
      >
        {/* Inner gradient overlay for depth */}
        <div className="absolute inset-0 rounded-t-md opacity-30 
                        bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        
        {/* Highlight effect for special states */}
        {(state === 'comparing' || state === 'swapping' || state === 'pivot') && (
          <div className="absolute inset-0 rounded-t-md 
                          bg-gradient-to-t from-transparent to-white/20 
                          animate-pulse pointer-events-none" />
        )}

        {/* Sorted celebration effect */}
        {state === 'sorted' && (
          <div className="absolute -inset-1 rounded-t-md 
                          bg-gradient-to-t from-transparent to-green-400/30 
                          animate-celebrate pointer-events-none" />
        )}

        {/* Bar height indicator line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 
                        bg-gradient-to-r from-transparent via-white/40 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Base reflection effect */}
      <div 
        className="w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent 
                   opacity-20 blur-sm"
        style={{ width: `${width}px` }}
      />
    </div>
  );
};
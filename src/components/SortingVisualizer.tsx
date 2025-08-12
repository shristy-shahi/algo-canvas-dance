import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import { SortingAlgorithms } from '@/lib/sortingAlgorithms';
import { ArrayBar } from '@/components/ArrayBar';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';

export interface ArrayElement {
  value: number;
  id: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

export interface SortingState {
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  timeElapsed: number;
}

const algorithms = [
  { value: 'bubble', label: 'Bubble Sort', complexity: 'O(n²)' },
  { value: 'selection', label: 'Selection Sort', complexity: 'O(n²)' },
  { value: 'insertion', label: 'Insertion Sort', complexity: 'O(n²)' },
  { value: 'merge', label: 'Merge Sort', complexity: 'O(n log n)' },
  { value: 'quick', label: 'Quick Sort', complexity: 'O(n log n)' },
  { value: 'heap', label: 'Heap Sort', complexity: 'O(n log n)' }
];

export const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [arraySize, setArraySize] = useState([50]);
  const [speed, setSpeed] = useState([50]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [metrics, setMetrics] = useState<SortingState>({
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    timeElapsed: 0
  });

  const sortingRef = useRef<{
    stop: () => void;
    promise: Promise<void>;
  } | null>(null);
  const startTimeRef = useRef<number>(0);

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < arraySize[0]; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 400) + 10,
        id: i,
        state: 'default'
      });
    }
    setArray(newArray);
    setIsSorted(false);
    setMetrics({
      comparisons: 0,
      swaps: 0,
      arrayAccesses: 0,
      timeElapsed: 0
    });
  }, [arraySize]);

  // Initialize array on mount and size change
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Animation step callback
  const animationStep = useCallback((
    newArray: ArrayElement[],
    comparisons: number,
    swaps: number,
    arrayAccesses: number
  ) => {
    setArray([...newArray]);
    setMetrics(prev => ({
      ...prev,
      comparisons,
      swaps,
      arrayAccesses,
      timeElapsed: Date.now() - startTimeRef.current
    }));
  }, []);

  // Handle sorting
  const handleSort = async () => {
    if (isPlaying) {
      // Stop sorting
      if (sortingRef.current) {
        sortingRef.current.stop();
        setIsPlaying(false);
      }
      return;
    }

    if (isSorted) {
      generateArray();
      return;
    }

    setIsPlaying(true);
    startTimeRef.current = Date.now();

    try {
      const sortingInstance = SortingAlgorithms[selectedAlgorithm as keyof typeof SortingAlgorithms](
        [...array],
        animationStep,
        101 - speed[0] // Convert speed slider to delay (higher speed = lower delay)
      );

      sortingRef.current = sortingInstance;
      await sortingInstance.promise;
      
      setIsSorted(true);
      setIsPlaying(false);
    } catch (error) {
      if (error instanceof Error && error.message === 'Sorting stopped') {
        // Normal stop, not an error
      } else {
        console.error('Sorting error:', error);
      }
      setIsPlaying(false);
    }
  };

  // Reset array to original state
  const handleReset = () => {
    if (sortingRef.current) {
      sortingRef.current.stop();
    }
    setIsPlaying(false);
    generateArray();
  };

  const getButtonText = () => {
    if (isPlaying) return 'Pause';
    if (isSorted) return 'Generate New Array';
    return 'Start Sorting';
  };

  const getButtonIcon = () => {
    if (isPlaying) return <Pause className="w-5 h-5" />;
    if (isSorted) return <Shuffle className="w-5 h-5" />;
    return <Play className="w-5 h-5" />;
  };

  const selectedAlgoInfo = algorithms.find(algo => algo.value === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 animate-entrance">
          <h1 className="gradient-title">
            Sorting Algorithm Visualizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Watch how different sorting algorithms work in real-time with beautiful animations and performance metrics
          </p>
        </div>

        {/* Enhanced Controls */}
        <div className="glass-panel p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Enhanced Algorithm Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Algorithm
              </label>
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger className="glass-panel border-border/30 h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-border/30">
                  {algorithms.map((algo) => (
                    <SelectItem key={algo.value} value={algo.value} className="cursor-pointer">
                      <div className="flex flex-col space-y-1 py-1">
                        <span className="font-medium">{algo.label}</span>
                        <span className="text-xs text-accent font-mono">{algo.complexity}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Enhanced Array Size */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Array Size: <span className="text-primary font-mono">{arraySize[0]}</span>
              </label>
              <div className="enhanced-slider">
                <Slider
                  value={arraySize}
                  onValueChange={setArraySize}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={isPlaying}
                />
              </div>
            </div>

            {/* Enhanced Speed */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Speed: <span className="text-accent font-mono">{speed[0]}%</span>
              </label>
              <div className="enhanced-slider">
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleSort}
                className="btn-control h-12 text-base font-semibold"
                disabled={false}
              >
                {getButtonIcon()}
                <span className="ml-2">{getButtonText()}</span>
              </Button>
              <Button 
                onClick={handleReset}
                className="btn-control secondary h-10"
                disabled={isPlaying}
              >
                <RotateCcw className="w-4 h-4" />
                <span className="ml-2">Reset</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Algorithm Info */}
          {selectedAlgoInfo && (
            <div className="mt-8 algo-info animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow"></div>
                  <span className="font-semibold text-foreground text-lg">{selectedAlgoInfo.label}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">Time Complexity:</span>
                  <span className="text-lg font-mono text-accent font-bold">{selectedAlgoInfo.complexity}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Performance Metrics */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <PerformanceMetrics metrics={metrics} />
        </div>

        {/* Enhanced Visualization */}
        <div className="glass-panel p-8 animate-fade-in relative" style={{ animationDelay: '0.6s' }}>
          {/* Visualization Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Live Sorting Visualization</h2>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded vis-bar comparing"></div>
                <span className="text-muted-foreground">Comparing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded vis-bar swapping"></div>
                <span className="text-muted-foreground">Swapping</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded vis-bar pivot"></div>
                <span className="text-muted-foreground">Pivot</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded vis-bar sorted"></div>
                <span className="text-muted-foreground">Sorted</span>
              </div>
            </div>
          </div>

          {/* Visualization Container */}
          <div className="relative">
            <div className="h-96 flex items-end justify-center gap-1 overflow-hidden 
                          bg-gradient-to-t from-background/50 to-transparent 
                          rounded-lg p-4 border border-border/20">
              {array.map((element, index) => (
                <ArrayBar
                  key={element.id}
                  value={element.value}
                  maxValue={400}
                  state={element.state}
                  width={Math.max(6, Math.floor((800 - array.length * 2) / array.length))}
                />
              ))}
            </div>
            
            {/* Array size indicator */}
            <div className="absolute bottom-2 right-4 text-xs text-muted-foreground font-mono">
              {array.length} elements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
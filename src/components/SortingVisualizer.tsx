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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sorting Algorithm Visualizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Watch how different sorting algorithms work in real-time
          </p>
        </div>

        {/* Controls */}
        <div className="glass-panel p-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Algorithm Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Algorithm</label>
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger className="bg-card/20 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {algorithms.map((algo) => (
                    <SelectItem key={algo.value} value={algo.value}>
                      <div className="flex flex-col">
                        <span>{algo.label}</span>
                        <span className="text-xs text-muted-foreground">{algo.complexity}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Array Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Array Size: {arraySize[0]}
              </label>
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

            {/* Speed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Speed: {speed[0]}%
              </label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <Button 
                onClick={handleSort}
                className="btn-control flex-1"
                disabled={false}
              >
                {getButtonIcon()}
                {getButtonText()}
              </Button>
              <Button 
                onClick={handleReset}
                className="btn-control secondary"
                disabled={isPlaying}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>
          </div>

          {/* Algorithm Info */}
          {selectedAlgoInfo && (
            <div className="mt-4 p-3 bg-card/10 rounded-lg border border-border/30">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{selectedAlgoInfo.label}</span>
                <span className="text-sm font-mono text-accent">{selectedAlgoInfo.complexity}</span>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics metrics={metrics} />

        {/* Visualization */}
        <div className="glass-panel p-6 animate-fade-in">
          <div className="h-96 flex items-end justify-center gap-1 overflow-hidden">
            {array.map((element) => (
              <ArrayBar
                key={element.id}
                value={element.value}
                maxValue={400}
                state={element.state}
                width={Math.max(6, Math.floor((800 - array.length * 2) / array.length))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
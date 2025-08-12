import { ArrayElement } from '@/components/SortingVisualizer';

export type AnimationCallback = (
  array: ArrayElement[],
  comparisons: number,
  swaps: number,
  arrayAccesses: number
) => void;

export interface SortingInstance {
  stop: () => void;
  promise: Promise<void>;
}

// Helper function to create a delay
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Base sorting class
abstract class BaseSorting {
  protected array: ArrayElement[];
  protected comparisons: number = 0;
  protected swaps: number = 0;
  protected arrayAccesses: number = 0;
  protected stopped: boolean = false;
  protected animationCallback: AnimationCallback;
  protected delayMs: number;

  constructor(array: ArrayElement[], animationCallback: AnimationCallback, delayMs: number) {
    this.array = array;
    this.animationCallback = animationCallback;
    this.delayMs = delayMs;
  }

  protected async animate(): Promise<void> {
    if (this.stopped) throw new Error('Sorting stopped');
    this.animationCallback(this.array, this.comparisons, this.swaps, this.arrayAccesses);
    await delay(this.delayMs);
  }

  protected async compare(i: number, j: number): Promise<boolean> {
    this.comparisons++;
    this.arrayAccesses += 2;
    
    // Highlight comparing elements
    this.array[i].state = 'comparing';
    this.array[j].state = 'comparing';
    await this.animate();
    
    const result = this.array[i].value > this.array[j].value;
    
    // Reset states
    this.array[i].state = 'default';
    this.array[j].state = 'default';
    
    return result;
  }

  protected async swap(i: number, j: number): Promise<void> {
    this.swaps++;
    this.arrayAccesses += 4;
    
    // Highlight swapping elements
    this.array[i].state = 'swapping';
    this.array[j].state = 'swapping';
    await this.animate();
    
    // Perform swap
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
    await this.animate();
    
    // Reset states
    this.array[i].state = 'default';
    this.array[j].state = 'default';
  }

  protected async markSorted(indices: number[]): Promise<void> {
    for (const index of indices) {
      this.array[index].state = 'sorted';
    }
    await this.animate();
  }

  protected async markPivot(index: number): Promise<void> {
    this.array[index].state = 'pivot';
    await this.animate();
  }

  stop(): void {
    this.stopped = true;
  }

  abstract sort(): Promise<void>;
}

// Bubble Sort Implementation
class BubbleSort extends BaseSorting {
  async sort(): Promise<void> {
    const n = this.array.length;
    
    for (let i = 0; i < n - 1; i++) {
      if (this.stopped) throw new Error('Sorting stopped');
      
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        if (this.stopped) throw new Error('Sorting stopped');
        
        if (await this.compare(j, j + 1)) {
          await this.swap(j, j + 1);
          swapped = true;
        }
      }
      
      // Mark the last element as sorted
      await this.markSorted([n - i - 1]);
      
      if (!swapped) break;
    }
    
    // Mark remaining elements as sorted
    await this.markSorted(Array.from({ length: n }, (_, i) => i));
  }
}

// Selection Sort Implementation
class SelectionSort extends BaseSorting {
  async sort(): Promise<void> {
    const n = this.array.length;
    
    for (let i = 0; i < n - 1; i++) {
      if (this.stopped) throw new Error('Sorting stopped');
      
      let minIdx = i;
      await this.markPivot(minIdx);
      
      for (let j = i + 1; j < n; j++) {
        if (this.stopped) throw new Error('Sorting stopped');
        
        this.comparisons++;
        this.arrayAccesses += 2;
        
        this.array[j].state = 'comparing';
        await this.animate();
        
        if (this.array[j].value < this.array[minIdx].value) {
          this.array[minIdx].state = 'default';
          minIdx = j;
          await this.markPivot(minIdx);
        } else {
          this.array[j].state = 'default';
        }
      }
      
      if (minIdx !== i) {
        this.array[minIdx].state = 'default';
        await this.swap(i, minIdx);
      } else {
        this.array[minIdx].state = 'default';
      }
      
      await this.markSorted([i]);
    }
    
    await this.markSorted([n - 1]);
  }
}

// Insertion Sort Implementation
class InsertionSort extends BaseSorting {
  async sort(): Promise<void> {
    const n = this.array.length;
    
    await this.markSorted([0]);
    
    for (let i = 1; i < n; i++) {
      if (this.stopped) throw new Error('Sorting stopped');
      
      const key = this.array[i];
      key.state = 'pivot';
      await this.animate();
      
      let j = i - 1;
      
      while (j >= 0 && this.array[j].value > key.value) {
        if (this.stopped) throw new Error('Sorting stopped');
        
        this.comparisons++;
        this.arrayAccesses += 2;
        
        this.array[j].state = 'comparing';
        await this.animate();
        
        this.array[j + 1] = this.array[j];
        this.array[j + 1].state = 'swapping';
        this.swaps++;
        this.arrayAccesses += 2;
        await this.animate();
        
        this.array[j].state = 'default';
        this.array[j + 1].state = 'sorted';
        j--;
      }
      
      this.array[j + 1] = key;
      this.array[j + 1].state = 'sorted';
      await this.animate();
    }
  }
}

// Merge Sort Implementation
class MergeSort extends BaseSorting {
  async sort(): Promise<void> {
    await this.mergeSort(0, this.array.length - 1);
    await this.markSorted(Array.from({ length: this.array.length }, (_, i) => i));
  }

  private async mergeSort(left: number, right: number): Promise<void> {
    if (this.stopped) throw new Error('Sorting stopped');
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    
    await this.mergeSort(left, mid);
    await this.mergeSort(mid + 1, right);
    await this.merge(left, mid, right);
  }

  private async merge(left: number, mid: number, right: number): Promise<void> {
    const leftArr = this.array.slice(left, mid + 1);
    const rightArr = this.array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      if (this.stopped) throw new Error('Sorting stopped');
      
      this.comparisons++;
      this.arrayAccesses += 2;
      
      // Highlight comparing elements
      this.array[k].state = 'comparing';
      await this.animate();
      
      if (leftArr[i].value <= rightArr[j].value) {
        this.array[k] = leftArr[i];
        this.array[k].state = 'swapping';
        i++;
      } else {
        this.array[k] = rightArr[j];
        this.array[k].state = 'swapping';
        j++;
      }
      
      this.arrayAccesses++;
      await this.animate();
      this.array[k].state = 'default';
      k++;
    }
    
    while (i < leftArr.length) {
      if (this.stopped) throw new Error('Sorting stopped');
      this.array[k] = leftArr[i];
      this.array[k].state = 'swapping';
      await this.animate();
      this.array[k].state = 'default';
      i++;
      k++;
      this.arrayAccesses++;
    }
    
    while (j < rightArr.length) {
      if (this.stopped) throw new Error('Sorting stopped');
      this.array[k] = rightArr[j];
      this.array[k].state = 'swapping';
      await this.animate();
      this.array[k].state = 'default';
      j++;
      k++;
      this.arrayAccesses++;
    }
  }
}

// Quick Sort Implementation
class QuickSort extends BaseSorting {
  async sort(): Promise<void> {
    await this.quickSort(0, this.array.length - 1);
    await this.markSorted(Array.from({ length: this.array.length }, (_, i) => i));
  }

  private async quickSort(low: number, high: number): Promise<void> {
    if (this.stopped) throw new Error('Sorting stopped');
    if (low < high) {
      const pi = await this.partition(low, high);
      await this.quickSort(low, pi - 1);
      await this.quickSort(pi + 1, high);
    }
  }

  private async partition(low: number, high: number): Promise<number> {
    const pivot = this.array[high].value;
    await this.markPivot(high);
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (this.stopped) throw new Error('Sorting stopped');
      
      this.comparisons++;
      this.arrayAccesses += 2;
      
      this.array[j].state = 'comparing';
      await this.animate();
      
      if (this.array[j].value < pivot) {
        i++;
        if (i !== j) {
          this.array[j].state = 'default';
          await this.swap(i, j);
        } else {
          this.array[j].state = 'default';
        }
      } else {
        this.array[j].state = 'default';
      }
    }
    
    this.array[high].state = 'default';
    if (i + 1 !== high) {
      await this.swap(i + 1, high);
    }
    
    return i + 1;
  }
}

// Heap Sort Implementation
class HeapSort extends BaseSorting {
  async sort(): Promise<void> {
    const n = this.array.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await this.heapify(n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      if (this.stopped) throw new Error('Sorting stopped');
      
      await this.swap(0, i);
      await this.markSorted([i]);
      await this.heapify(i, 0);
    }
    
    await this.markSorted([0]);
  }

  private async heapify(n: number, i: number): Promise<void> {
    if (this.stopped) throw new Error('Sorting stopped');
    
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    await this.markPivot(largest);
    
    if (left < n) {
      this.comparisons++;
      this.arrayAccesses += 2;
      this.array[left].state = 'comparing';
      await this.animate();
      
      if (this.array[left].value > this.array[largest].value) {
        this.array[largest].state = 'default';
        largest = left;
        await this.markPivot(largest);
      }
      this.array[left].state = 'default';
    }
    
    if (right < n) {
      this.comparisons++;
      this.arrayAccesses += 2;
      this.array[right].state = 'comparing';
      await this.animate();
      
      if (this.array[right].value > this.array[largest].value) {
        this.array[largest].state = 'default';
        largest = right;
        await this.markPivot(largest);
      }
      this.array[right].state = 'default';
    }
    
    if (largest !== i) {
      this.array[largest].state = 'default';
      await this.swap(i, largest);
      await this.heapify(n, largest);
    } else {
      this.array[largest].state = 'default';
    }
  }
}

// Factory function to create sorting instances
const createSortingInstance = (
  SortClass: new (array: ArrayElement[], callback: AnimationCallback, delay: number) => BaseSorting,
  array: ArrayElement[],
  animationCallback: AnimationCallback,
  delayMs: number
): SortingInstance => {
  const instance = new SortClass(array, animationCallback, delayMs);
  
  return {
    stop: () => instance.stop(),
    promise: instance.sort()
  };
};

export const SortingAlgorithms = {
  bubble: (array: ArrayElement[], callback: AnimationCallback, delay: number) =>
    createSortingInstance(BubbleSort, array, callback, delay),
  
  selection: (array: ArrayElement[], callback: AnimationCallback, delay: number) =>
    createSortingInstance(SelectionSort, array, callback, delay),
  
  insertion: (array: ArrayElement[], callback: AnimationCallback, delay: number) =>
    createSortingInstance(InsertionSort, array, callback, delay),
  
  merge: (array: ArrayElement[], callback: AnimationCallback, delay: number) =>
    createSortingInstance(MergeSort, array, callback, delay),
  
  quick: (array: ArrayElement[], callback: AnimationCallback, delay: number) =>
    createSortingInstance(QuickSort, array, callback, delay),
  
  heap: (array: ArrayElement[], callback: AnimationCallback, delay: number) =>
    createSortingInstance(HeapSort, array, callback, delay)
};
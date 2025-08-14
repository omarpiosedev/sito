/**
 * Performance testing utilities for optimized animation components
 */

export interface PerformanceMetrics {
  frameRate: number;
  memoryUsage: number;
  cpuUsage: number;
  renderTime: number;
  isVisible: boolean;
  timestamp: number;
}

export class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastFrameTime = 0;
  private frameRate = 0;
  private renderTimes: number[] = [];
  private isRunning = false;

  private rafId?: number;
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    if (this.isRunning) return;
    this.isRunning = true;

    const monitor = (timestamp: number) => {
      if (this.lastFrameTime) {
        const delta = timestamp - this.lastFrameTime;
        this.frameCount++;

        // Calculate FPS over last second
        if (this.frameCount >= 60) {
          this.frameRate = Math.round(1000 / (delta / this.frameCount));
          this.frameCount = 0;
        }
      }

      this.lastFrameTime = timestamp;

      // Measure render time
      const renderStart = performance.now();
      // Simulate light rendering work
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;

      this.renderTimes.push(renderTime);
      if (this.renderTimes.length > 60) {
        this.renderTimes.shift();
      }

      // Notify observers
      const metrics: PerformanceMetrics = {
        frameRate: this.frameRate,
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: this.getCPUUsage(),
        renderTime: this.getAverageRenderTime(),
        isVisible: !document.hidden,
        timestamp: Date.now(),
      };

      this.observers.forEach(observer => observer(metrics));

      if (this.isRunning) {
        this.rafId = requestAnimationFrame(monitor);
      }
    };

    this.rafId = requestAnimationFrame(monitor);
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return 0;
  }

  private getCPUUsage(): number {
    // Simplified CPU usage estimation based on render times
    const avgRenderTime = this.getAverageRenderTime();
    return Math.min(100, avgRenderTime * 10); // Rough estimation
  }

  private getAverageRenderTime(): number {
    if (this.renderTimes.length === 0) return 0;
    const sum = this.renderTimes.reduce((a, b) => a + b, 0);
    return Math.round((sum / this.renderTimes.length) * 100) / 100;
  }

  subscribe(observer: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  getSnapshot(): PerformanceMetrics {
    return {
      frameRate: this.frameRate,
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCPUUsage(),
      renderTime: this.getAverageRenderTime(),
      isVisible: !document.hidden,
      timestamp: Date.now(),
    };
  }
}

// Singleton instance
let performanceMonitor: AnimationPerformanceMonitor | null = null;

export function getPerformanceMonitor(): AnimationPerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new AnimationPerformanceMonitor();
  }
  return performanceMonitor;
}

// Performance testing utilities
export function measureAnimationPerformance(
  componentName: string,
  duration: number = 5000
): Promise<PerformanceMetrics[]> {
  return new Promise(resolve => {
    const metrics: PerformanceMetrics[] = [];
    const monitor = getPerformanceMonitor();

    const unsubscribe = monitor.subscribe(metric => {
      metrics.push({
        ...metric,
        timestamp: Date.now(),
      });
    });

    setTimeout(() => {
      unsubscribe();
      console.log(`Performance test for ${componentName} completed:`, {
        averageFrameRate:
          metrics.reduce((sum, m) => sum + m.frameRate, 0) / metrics.length,
        averageMemoryUsage:
          metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
        averageRenderTime:
          metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length,
        totalSamples: metrics.length,
      });
      resolve(metrics);
    }, duration);
  });
}

// Intersection Observer performance helper
export function createOptimizedIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// Reduced motion detection
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

// Hardware acceleration helper
export function getHardwareAccelerationStyles() {
  return {
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform',
    backfaceVisibility: 'hidden' as const,
  };
}

// Performance recommendations based on device
export function getPerformanceRecommendations() {
  const recommendations = {
    enableHardwareAcceleration: true,
    useIntersectionObserver: true,
    throttleAnimations: false,
    reducedAnimations: useReducedMotion(),
  };

  // Detect low-end devices
  if (
    'hardwareConcurrency' in navigator &&
    navigator.hardwareConcurrency <= 2
  ) {
    recommendations.throttleAnimations = true;
  }

  // Check memory constraints
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const totalMemory = memory.totalJSHeapSize / 1024 / 1024; // MB
    if (totalMemory < 100) {
      recommendations.throttleAnimations = true;
    }
  }

  return recommendations;
}

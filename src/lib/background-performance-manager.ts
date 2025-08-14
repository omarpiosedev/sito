/**
 * Background Performance Manager
 * Centralized performance optimization system for background components
 *
 * Features:
 * - GPU resource management and pooling
 * - Adaptive quality based on device performance
 * - Visibility-based rendering optimization
 * - Performance monitoring and metrics
 * - Memory leak prevention
 */

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  gpuUtilization: number;
  renderTime: number;
  activeBackgrounds: number;
}

export interface BackgroundInstance {
  id: string;
  type: 'webgl' | 'canvas2d' | 'css';
  isVisible: boolean;
  isActive: boolean;
  priority: number;
  lastRenderTime: number;
  cleanup: () => void;
}

export interface PerformanceSettings {
  maxActiveBackgrounds: number;
  targetFPS: number;
  adaptiveQuality: boolean;
  memoryThreshold: number; // MB
  gpuThreshold: number; // 0-1
  reducedMotionMode: boolean;
}

class BackgroundPerformanceManager {
  private instances = new Map<string, BackgroundInstance>();
  private performanceMetrics: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    gpuUtilization: 0,
    renderTime: 0,
    activeBackgrounds: 0,
  };
  private settings: PerformanceSettings = {
    maxActiveBackgrounds: 3,
    targetFPS: 60,
    adaptiveQuality: true,
    memoryThreshold: 100, // 100MB
    gpuThreshold: 0.8, // 80%
    reducedMotionMode: false,
  };
  private monitoringThrottled = false;
  private lastMonitoringUpdate = 0;
  private observers = new Map<string, IntersectionObserver>();
  private performanceObserver: PerformanceObserver | null = null;
  private lastFrameTime = 0;
  private frameCount = 0;
  private isTabActive = true;
  private devicePixelRatio = 1;
  private hasGPUTier = false;
  private gpuTier = 1; // 1-4 scale
  private isClient = false;
  private isInitialized = false;

  constructor() {
    // Check if we're in a browser environment
    this.isClient = typeof window !== 'undefined';

    if (this.isClient) {
      // Only initialize client-side functionality in browser
      this.initialize();
    }
  }

  private initialize(): void {
    if (this.isInitialized || !this.isClient) return;

    this.isInitialized = true;
    this.initializePerformanceMonitoring();
    this.detectDeviceCapabilities();
    this.setupEventListeners();
  }

  private initializePerformanceMonitoring(): void {
    // Only run in browser environment
    if (!this.isClient || typeof requestAnimationFrame === 'undefined') return;

    // FPS monitoring
    const measureFPS = () => {
      const now = performance.now();
      this.frameCount++;

      if (now - this.lastFrameTime >= 1000) {
        this.performanceMetrics.fps = Math.round(
          (this.frameCount * 1000) / (now - this.lastFrameTime)
        );
        this.frameCount = 0;
        this.lastFrameTime = now;

        this.adjustQualityBasedOnPerformance();
      }

      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(measureFPS);
      }
    };

    // Only start FPS monitoring in browser
    if (typeof requestAnimationFrame !== 'undefined') {
      measureFPS();
    }

    // Memory monitoring
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.performanceMetrics.memoryUsage =
          memory.usedJSHeapSize / 1024 / 1024; // MB
      }, 5000);
    }

    // Performance Observer for render timing
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'measure') {
            this.performanceMetrics.renderTime = entry.duration;
          }
        });
      });
      this.performanceObserver.observe({ entryTypes: ['measure'] });
    }
  }

  private async detectDeviceCapabilities(): Promise<void> {
    // Only run in browser environment
    if (!this.isClient || typeof window === 'undefined') return;

    // Detect GPU tier
    try {
      // Try to dynamically import detect-gpu if available
      const { getGPUTier } = await import('detect-gpu');
      const gpuInfo = await getGPUTier();
      this.gpuTier = gpuInfo.tier;
      this.hasGPUTier = true;
    } catch {
      // Fallback GPU detection based on device pixel ratio and canvas performance
      this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      this.gpuTier = this.devicePixelRatio > 1 ? 2 : 1;
    }

    // Adjust settings based on device capabilities
    if (this.gpuTier <= 1) {
      this.settings.maxActiveBackgrounds = 2;
      this.settings.targetFPS = 30;
    } else if (this.gpuTier >= 3) {
      this.settings.maxActiveBackgrounds = 5;
      this.settings.targetFPS = 60;
    }
  }

  private setupEventListeners(): void {
    // Only run in browser environment
    if (
      !this.isClient ||
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    )
      return;

    // Tab visibility
    document.addEventListener('visibilitychange', () => {
      this.isTabActive = !document.hidden;
      this.updateAllInstancesVisibility();
    });

    // Reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.settings.reducedMotionMode = mediaQuery.matches;

    mediaQuery.addEventListener('change', e => {
      this.settings.reducedMotionMode = e.matches;
      this.updateAllInstancesVisibility();
    });

    // Page unload cleanup
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  private adjustQualityBasedOnPerformance(): void {
    if (!this.settings.adaptiveQuality) return;

    const { fps, memoryUsage } = this.performanceMetrics;
    const activeCount = this.getActiveBackgroundCount();

    // Reduce quality if performance is poor
    if (
      fps < this.settings.targetFPS * 0.8 ||
      memoryUsage > this.settings.memoryThreshold ||
      activeCount > this.settings.maxActiveBackgrounds
    ) {
      this.degradePerformance();
    }
    // Restore quality if performance improves
    else if (
      fps >= this.settings.targetFPS * 0.95 &&
      memoryUsage < this.settings.memoryThreshold * 0.8
    ) {
      this.restorePerformance();
    }
  }

  private degradePerformance(): void {
    // Deactivate lowest priority backgrounds first
    const sortedInstances = Array.from(this.instances.values())
      .filter(instance => instance.isActive)
      .sort((a, b) => a.priority - b.priority);

    for (const instance of sortedInstances) {
      if (
        this.getActiveBackgroundCount() <= this.settings.maxActiveBackgrounds
      ) {
        break;
      }
      this.setInstanceActive(instance.id, false);
    }
  }

  private restorePerformance(): void {
    // Reactivate high priority visible backgrounds
    const sortedInstances = Array.from(this.instances.values())
      .filter(instance => !instance.isActive && instance.isVisible)
      .sort((a, b) => b.priority - a.priority);

    for (const instance of sortedInstances) {
      if (
        this.getActiveBackgroundCount() >= this.settings.maxActiveBackgrounds
      ) {
        break;
      }
      this.setInstanceActive(instance.id, true);
    }
  }

  private updateAllInstancesVisibility(): void {
    this.instances.forEach(instance => {
      const shouldBeActive = this.shouldInstanceBeActive(instance);
      if (instance.isActive !== shouldBeActive) {
        this.setInstanceActive(instance.id, shouldBeActive);
      }
    });
  }

  private shouldInstanceBeActive(instance: BackgroundInstance): boolean {
    return (
      this.isTabActive &&
      instance.isVisible &&
      !this.settings.reducedMotionMode &&
      this.getActiveBackgroundCount() < this.settings.maxActiveBackgrounds
    );
  }

  private getActiveBackgroundCount(): number {
    return Array.from(this.instances.values()).filter(
      instance => instance.isActive
    ).length;
  }

  private setInstanceActive(id: string, active: boolean): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.isActive = active;
      this.performanceMetrics.activeBackgrounds =
        this.getActiveBackgroundCount();
    }
  }

  public registerBackground(
    id: string,
    type: BackgroundInstance['type'],
    priority: number,
    cleanup: () => void
  ): void {
    if (this.instances.has(id)) {
      console.warn(`Background instance ${id} already registered`);
      return;
    }

    const instance: BackgroundInstance = {
      id,
      type,
      isVisible: false,
      isActive: false,
      priority,
      lastRenderTime: 0,
      cleanup,
    };

    this.instances.set(id, instance);
    this.createVisibilityObserver(id);

    // Auto-activate high priority instances (priority >= 10) if under limit
    if (
      priority >= 10 &&
      this.getActiveBackgroundCount() < this.settings.maxActiveBackgrounds
    ) {
      this.setInstanceActive(id, true);
    }
  }

  public unregisterBackground(id: string): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.cleanup();
      this.instances.delete(id);

      const observer = this.observers.get(id);
      if (observer) {
        observer.disconnect();
        this.observers.delete(id);
      }

      this.performanceMetrics.activeBackgrounds =
        this.getActiveBackgroundCount();
    }
  }

  public createVisibilityObserver(id: string): IntersectionObserver | null {
    // Return null if not in browser environment
    if (
      !this.isClient ||
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return null;
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        const instance = this.instances.get(id);
        if (instance) {
          instance.isVisible = entry.isIntersecting;
          const shouldBeActive = this.shouldInstanceBeActive(instance);
          this.setInstanceActive(id, shouldBeActive);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Pre-load slightly before visible
      }
    );

    this.observers.set(id, observer);
    return observer;
  }

  public updateRenderTime(id: string, renderTime: number): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.lastRenderTime = renderTime;
    }
  }

  public isBackgroundActive(id: string): boolean {
    const instance = this.instances.get(id);
    return instance ? instance.isActive : false;
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    // Throttling per produzione - aggiorna metriche solo ogni 2 secondi
    const now = Date.now();
    const throttleMs = process.env.NODE_ENV === 'production' ? 2000 : 500;

    if (
      now - this.lastMonitoringUpdate < throttleMs &&
      this.monitoringThrottled
    ) {
      return { ...this.performanceMetrics };
    }

    this.lastMonitoringUpdate = now;
    this.monitoringThrottled = true;

    // Aggiorna solo le metriche essenziali in produzione
    if (process.env.NODE_ENV === 'production') {
      this.performanceMetrics.activeBackgrounds =
        this.getActiveBackgroundCount();
      // Skip costly FPS e GPU calculations in produzione
    } else {
      // Update completo in development
      this.performanceMetrics.activeBackgrounds =
        this.getActiveBackgroundCount();
    }

    return { ...this.performanceMetrics };
  }

  public getSettings(): PerformanceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<PerformanceSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.updateAllInstancesVisibility();
  }

  public getOptimalFrameRate(id: string): number {
    const instance = this.instances.get(id);
    if (!instance) return 60;

    // Lower frame rate for lower priority backgrounds
    const priorityMultiplier = Math.max(0.5, instance.priority / 10);
    return Math.round(this.settings.targetFPS * priorityMultiplier);
  }

  public getOptimalQuality(id: string): number {
    const { fps, memoryUsage } = this.performanceMetrics;
    const instance = this.instances.get(id);
    if (!instance) return 1;

    let quality = 1;

    // Reduce quality based on performance
    if (fps < this.settings.targetFPS * 0.8) {
      quality *= 0.7;
    }
    if (memoryUsage > this.settings.memoryThreshold * 0.8) {
      quality *= 0.8;
    }
    if (this.getActiveBackgroundCount() > this.settings.maxActiveBackgrounds) {
      quality *= 0.6;
    }

    // GPU tier adjustment
    quality *= Math.min(1, this.gpuTier / 2);

    return Math.max(0.3, quality);
  }

  public shouldUseReducedMotion(): boolean {
    return this.settings.reducedMotionMode;
  }

  public cleanup(): void {
    // Cleanup all instances
    this.instances.forEach(instance => {
      instance.cleanup();
    });
    this.instances.clear();

    // Cleanup observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();

    // Cleanup performance observer
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }
}

// Singleton instance - only create in browser environment
let backgroundPerformanceManagerInstance: BackgroundPerformanceManager | null =
  null;

export const getBackgroundPerformanceManager =
  (): BackgroundPerformanceManager => {
    if (!backgroundPerformanceManagerInstance) {
      backgroundPerformanceManagerInstance = new BackgroundPerformanceManager();
    }
    return backgroundPerformanceManagerInstance;
  };

// Alias method for backward compatibility
// export { getPerformanceMetrics as getMetrics } from BackgroundPerformanceManager;

// Export singleton instance for backward compatibility
export const backgroundPerformanceManager =
  typeof window !== 'undefined' ? getBackgroundPerformanceManager() : null;

// Export convenience hooks
export const useBackgroundPerformance = (
  id: string,
  type: BackgroundInstance['type'],
  priority: number = 5
) => {
  // Get manager instance, handling SSR
  const manager =
    backgroundPerformanceManager || getBackgroundPerformanceManager();

  // SSR-safe fallback functions
  const register = (cleanup: () => void) => {
    if (manager) {
      manager.registerBackground(id, type, priority, cleanup);
    }
  };

  const unregister = () => {
    if (manager) {
      manager.unregisterBackground(id);
    }
  };

  const isActive = () => (manager ? manager.isBackgroundActive(id) : false);
  const optimalFrameRate = () =>
    manager ? manager.getOptimalFrameRate(id) : 60;
  const optimalQuality = () => (manager ? manager.getOptimalQuality(id) : 1);
  const shouldReduceMotion = () =>
    manager ? manager.shouldUseReducedMotion() : false;
  const createVisibilityObserver = () =>
    manager ? manager.createVisibilityObserver(id) : null;
  const updateRenderTime = (time: number) => {
    if (manager) {
      manager.updateRenderTime(id, time);
    }
  };

  return {
    register,
    unregister,
    isActive,
    optimalFrameRate,
    optimalQuality,
    shouldReduceMotion,
    createVisibilityObserver,
    updateRenderTime,
    manager,
  };
};

/**
 * Optimized Performance Monitor
 *
 * Versione ottimizzata del performance monitor con:
 * - Throttling intelligente per ridurre overhead
 * - Conditional monitoring basato su environment
 * - Sampling rate adattivo
 * - Graceful degradation
 */

'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  getBackgroundPerformanceManager,
  PerformanceMetrics,
} from './background-performance-manager';

interface OptimizedPerformanceMonitorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  enabled?: boolean;
  throttleMs?: number; // Intervallo di aggiornamento in ms
  enabledInProduction?: boolean; // Se abilitare in produzione
  samplingRate?: number; // % di campionamento (0-100)
}

/**
 * Performance monitor ottimizzato per ridurre l'overhead
 */
const OptimizedPerformanceMonitor: React.FC<
  OptimizedPerformanceMonitorProps
> = ({
  position = 'bottom-right',
  enabled = process.env.NODE_ENV === 'development',
  throttleMs = 1000, // Aggiorna ogni secondo invece di 100ms
  enabledInProduction = false,
  samplingRate = 10, // Solo 10% delle misurazioni in produzione
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    gpuUtilization: 0,
    renderTime: 0,
    activeBackgrounds: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const sampleCountRef = useRef(0);

  // Determina se il monitor deve essere attivo
  const shouldMonitor = useCallback(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const isProd = process.env.NODE_ENV === 'production';

    if (!enabled) return false;
    if (isDev) return true;
    if (isProd && enabledInProduction) {
      // In produzione, usa sampling rate
      sampleCountRef.current++;
      return sampleCountRef.current % Math.floor(100 / samplingRate) === 0;
    }

    return false;
  }, [enabled, enabledInProduction, samplingRate]);

  // Throttled update function
  const updateMetrics = useCallback(() => {
    if (!shouldMonitor()) return;

    try {
      const manager = getBackgroundPerformanceManager();
      if (manager) {
        const currentMetrics = manager.getPerformanceMetrics();
        setMetrics(currentMetrics);
      }
    } catch (error) {
      // Fail silently in produzione per evitare crash
      if (process.env.NODE_ENV === 'development') {
        console.warn('Performance monitor error:', error);
      }
    }
  }, [shouldMonitor]);

  // Gestione visibilità per ottimizzazione
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const element = document.querySelector('[data-performance-monitor]');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Avvio/stop del monitoring
  useEffect(() => {
    if (!shouldMonitor() || !isVisible) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    // Throttled interval con adaptive rate
    const adaptiveThrottleMs =
      process.env.NODE_ENV === 'production'
        ? Math.max(throttleMs * 2, 2000) // Più lento in produzione
        : throttleMs;

    intervalRef.current = setInterval(updateMetrics, adaptiveThrottleMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [shouldMonitor, isVisible, updateMetrics, throttleMs]);

  // Non renderizzare se disabilitato o in produzione senza flag
  if (
    !enabled ||
    (process.env.NODE_ENV === 'production' && !enabledInProduction)
  ) {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getStatusColor = (value: number, type: 'fps' | 'memory' | 'gpu') => {
    switch (type) {
      case 'fps':
        return value >= 55
          ? 'text-green-400'
          : value >= 30
            ? 'text-yellow-400'
            : 'text-red-400';
      case 'memory':
        return value <= 50
          ? 'text-green-400'
          : value <= 80
            ? 'text-yellow-400'
            : 'text-red-400';
      case 'gpu':
        return value <= 0.7
          ? 'text-green-400'
          : value <= 0.9
            ? 'text-yellow-400'
            : 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div
      data-performance-monitor
      className={`fixed ${positionClasses[position]} z-50 font-mono text-xs`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden">
        {/* Header compatto */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3 py-2 text-left hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-300">PERF</span>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(metrics.fps, 'fps')}`}
              />
              <span className="text-xs text-gray-400">
                {isExpanded ? '−' : '+'}
              </span>
            </div>
          </div>
        </button>

        {/* Dettagli espansi con dati throttled */}
        {isExpanded && (
          <div className="px-3 py-2 border-t border-gray-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">FPS:</span>
              <span className={getStatusColor(metrics.fps, 'fps')}>
                {metrics.fps.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">MEM:</span>
              <span className={getStatusColor(metrics.memoryUsage, 'memory')}>
                {metrics.memoryUsage.toFixed(1)}MB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">GPU:</span>
              <span className={getStatusColor(metrics.gpuUtilization, 'gpu')}>
                {(metrics.gpuUtilization * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">BG:</span>
              <span className="text-gray-300">{metrics.activeBackgrounds}</span>
            </div>

            {/* Indicatori environment */}
            <div className="pt-1 border-t border-gray-700">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">ENV:</span>
                <span className="text-gray-400">
                  {process.env.NODE_ENV}
                  {process.env.NODE_ENV === 'production' &&
                    enabledInProduction && (
                      <span className="text-yellow-400 ml-1">
                        ({samplingRate}%)
                      </span>
                    )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizedPerformanceMonitor;

/**
 * Hook per conditional performance monitoring
 * Permette di abilitare/disabilitare il monitoring in base a condizioni
 */
export function useConditionalPerformanceMonitoring(conditions: {
  onLowPerformance?: () => void;
  onHighMemoryUsage?: () => void;
  thresholds?: {
    fps?: number;
    memory?: number;
    gpu?: number;
  };
}) {
  const metricsRef = useRef<PerformanceMetrics | undefined>(undefined);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return; // Solo in development

    const checkConditions = () => {
      const manager = getBackgroundPerformanceManager();
      if (!manager) return;

      const metrics = manager.getPerformanceMetrics();
      metricsRef.current = metrics;

      const thresholds = {
        fps: 30,
        memory: 100,
        gpu: 0.9,
        ...conditions.thresholds,
      };

      if (metrics.fps < thresholds.fps) {
        conditions.onLowPerformance?.();
      }

      if (metrics.memoryUsage > thresholds.memory) {
        conditions.onHighMemoryUsage?.();
      }
    };

    const interval = setInterval(checkConditions, 5000); // Check ogni 5 secondi
    return () => clearInterval(interval);
  }, [conditions]);

  return metricsRef.current;
}

/**
 * Background Performance Monitor Dashboard
 *
 * A development utility component that displays real-time performance metrics
 * for background components. Only renders in development mode.
 */

'use client';
import React, { useState, useEffect } from 'react';
import {
  backgroundPerformanceManager,
  getBackgroundPerformanceManager,
  PerformanceMetrics,
} from './background-performance-manager';

interface PerformanceMonitorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  enabled?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  position = 'bottom-right',
  enabled = process.env.NODE_ENV === 'development',
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

  useEffect(() => {
    if (!enabled) return;

    const manager =
      backgroundPerformanceManager || getBackgroundPerformanceManager();
    if (!manager) return;

    const updateMetrics = () => {
      setMetrics(manager.getPerformanceMetrics());
    };

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics();

    return () => clearInterval(interval);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Show monitor after a short delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return 'text-red-400';
    if (value >= thresholds[0]) return 'text-yellow-400';
    return 'text-green-400';
  };

  const fpsColor = getStatusColor(60 - metrics.fps, [10, 20]); // Good: >50fps, Warning: >40fps, Bad: <40fps
  const memoryColor = getStatusColor(metrics.memoryUsage, [50, 100]); // MB
  const renderColor = getStatusColor(metrics.renderTime, [8, 16]); // ms

  return (
    <div
      className={`fixed ${positionClasses[position]} z-[9999] transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
    >
      <div className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 text-left hover:bg-gray-800/50 transition-colors rounded-lg"
          title="Performance Monitor"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${fpsColor === 'text-green-400' ? 'bg-green-400' : fpsColor === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-red-400'}`}
              />
              {isExpanded && (
                <span className="text-white text-sm font-medium">
                  Performance
                </span>
              )}
            </div>
            {isExpanded && (
              <span className="text-gray-400 text-xs">
                {metrics.activeBackgrounds} BG
              </span>
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-3 pt-0">
            <div className="space-y-2 text-xs">
              {/* FPS */}
              <div className="flex justify-between items-center">
                <span className="text-gray-300">FPS:</span>
                <span className={fpsColor}>{Math.round(metrics.fps)}</span>
              </div>

              {/* Memory Usage */}
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Memory:</span>
                <span className={memoryColor}>
                  {metrics.memoryUsage.toFixed(1)}MB
                </span>
              </div>

              {/* Render Time */}
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Render:</span>
                <span className={renderColor}>
                  {metrics.renderTime.toFixed(1)}ms
                </span>
              </div>

              {/* Active Backgrounds */}
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active BG:</span>
                <span className="text-blue-400">
                  {metrics.activeBackgrounds}
                </span>
              </div>

              {/* Settings Summary */}
              <div className="mt-3 pt-2 border-t border-gray-700">
                <div className="text-gray-400 text-xs">
                  {(() => {
                    const manager =
                      backgroundPerformanceManager ||
                      getBackgroundPerformanceManager();
                    if (!manager) return 'Settings: N/A (SSR)';
                    const settings = manager.getSettings();
                    return `Settings: Auto-${settings.adaptiveQuality ? 'ON' : 'OFF'}${settings.reducedMotionMode ? ' | Reduced Motion' : ''}`;
                  })()}
                </div>
              </div>

              {/* Performance Tips */}
              {(metrics.fps < 45 ||
                metrics.memoryUsage > 80 ||
                metrics.renderTime > 12) && (
                <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-600/30 rounded text-yellow-200 text-xs">
                  <div className="font-medium mb-1">Performance Issues:</div>
                  {metrics.fps < 45 && <div>• Low FPS detected</div>}
                  {metrics.memoryUsage > 80 && <div>• High memory usage</div>}
                  {metrics.renderTime > 12 && <div>• Slow render times</div>}
                  <div className="mt-1 text-yellow-300">
                    Consider reducing background quality or quantity.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;

// Usage example component for development
export const BackgroundPerformanceDashboard: React.FC = () => {
  const [showDetailed, setShowDetailed] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (!showDetailed) return;

    const manager =
      backgroundPerformanceManager || getBackgroundPerformanceManager();
    if (!manager) return;

    const updateMetrics = () => {
      setMetrics(manager.getPerformanceMetrics());
    };

    const interval = setInterval(updateMetrics, 500);
    updateMetrics();

    return () => clearInterval(interval);
  }, [showDetailed]);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <PerformanceMonitor />

      {/* Detailed Dashboard (optional) */}
      {showDetailed && metrics && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Performance Dashboard
              </h2>
              <button
                onClick={() => setShowDetailed(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Frame Rate:</span>
                    <span className="text-green-400">
                      {Math.round(metrics.fps)} FPS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Memory Usage:</span>
                    <span className="text-blue-400">
                      {metrics.memoryUsage.toFixed(1)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Render Time:</span>
                    <span className="text-yellow-400">
                      {metrics.renderTime.toFixed(1)} ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Backgrounds:</span>
                    <span className="text-purple-400">
                      {metrics.activeBackgrounds}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Settings</h3>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const manager =
                      backgroundPerformanceManager ||
                      getBackgroundPerformanceManager();
                    if (!manager) return <div>Settings: N/A (SSR)</div>;
                    return Object.entries(manager.getSettings()).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-gray-100">
                            {typeof value === 'boolean'
                              ? value
                                ? 'ON'
                                : 'OFF'
                              : value}
                          </span>
                        </div>
                      )
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-800 rounded">
              <h4 className="text-sm font-semibold text-white mb-2">
                Performance Recommendations
              </h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>
                  • Background components automatically adjust quality based on
                  device performance
                </li>
                <li>
                  • Frame rate is limited to optimal values to prevent battery
                  drain
                </li>
                <li>• Memory usage is monitored to prevent crashes</li>
                <li>
                  • Reduced motion preferences are respected for accessibility
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

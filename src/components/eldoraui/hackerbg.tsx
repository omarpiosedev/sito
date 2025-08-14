'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useBackgroundPerformance } from '@/lib/background-performance-manager';

interface HackerBackgroundProps {
  color?: string;
  fontSize?: number;
  className?: string;
  speed?: number;
  delay?: number;
  reset?: boolean;
  priority?: number;
}

const HackerBackground: React.FC<HackerBackgroundProps> = ({
  color = '#0F0',
  fontSize = 14,
  className = '',
  speed = 1,
  delay = 0,
  reset = false,
  priority = 6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const dropsRef = useRef<number[]>([]);
  const columnsRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const renderStartRef = useRef(0);

  // Visibility state managed by performance manager
  // const [isVisible, setIsVisible] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);

  // Generate unique ID for this instance
  const instanceId = useMemo(
    () => `hacker-bg-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  // Use performance manager
  const {
    register,
    unregister,
    isActive,
    optimalFrameRate,
    optimalQuality,
    shouldReduceMotion,
    createVisibilityObserver,
    updateRenderTime,
  } = useBackgroundPerformance(instanceId, 'canvas2d', priority);

  // Pre-computed character array for better performance
  const chars = useMemo(
    () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+'.split(
        ''
      ),
    []
  );

  // Visibility detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = createVisibilityObserver();
    if (observer) {
      observer.observe(canvas);
    }

    return () => observer?.disconnect();
  }, [createVisibilityObserver]);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Main animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Better performance for animations
    });
    if (!ctx) return;

    contextRef.current = ctx;

    // Performance optimizations
    ctx.imageSmoothingEnabled = false; // Disable for pixel-perfect text

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, optimalQuality() * 2);
      const rect = canvas.getBoundingClientRect();

      // Only resize if dimensions actually changed
      if (
        lastSizeRef.current.width !== rect.width ||
        lastSizeRef.current.height !== rect.height
      ) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = false;

        lastSizeRef.current = { width: rect.width, height: rect.height };

        // Recalculate drops array
        const newColumns = Math.floor(rect.width / fontSize);
        if (newColumns !== columnsRef.current) {
          columnsRef.current = newColumns;
          dropsRef.current = new Array(newColumns)
            .fill(0)
            .map(() => -Math.floor(Math.random() * 50));
        }
      }
    };

    const resetDrops = () => {
      for (let i = 0; i < dropsRef.current.length; i++) {
        dropsRef.current[i] = -Math.floor(Math.random() * 50);
      }
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (reset) {
      resetDrops();
    }

    const draw = (currentTime: number) => {
      // Performance tracking
      renderStartRef.current = performance.now();

      // Check if should render based on performance manager
      if (!isActive() || !isTabActive || shouldReduceMotion()) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      // Apply delay
      if (currentTime - startTimeRef.current < delay * 1000) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // Dynamic frame rate based on performance
      const targetInterval = 1000 / optimalFrameRate();
      const deltaTime = currentTime - lastFrameTimeRef.current;

      if (deltaTime < targetInterval) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      lastFrameTimeRef.current = currentTime;

      const quality = optimalQuality();
      const canvas = canvasRef.current;
      const ctx = contextRef.current;

      if (!canvas || !ctx) return;

      // Adaptive trail opacity based on quality
      const trailOpacity = Math.max(0.02, 0.05 * quality);
      ctx.fillStyle = `rgba(0, 0, 0, ${trailOpacity})`;
      ctx.fillRect(
        0,
        0,
        canvas.width / (window.devicePixelRatio || 1),
        canvas.height / (window.devicePixelRatio || 1)
      );

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      // Adaptive column rendering based on quality
      const columnsToRender = Math.ceil(dropsRef.current.length * quality);
      const step = Math.max(
        1,
        Math.floor(dropsRef.current.length / columnsToRender)
      );

      for (let i = 0; i < dropsRef.current.length; i += step) {
        const charIndex = Math.floor(Math.random() * chars.length);
        const text = chars[charIndex];

        ctx.fillText(text, i * fontSize, dropsRef.current[i] * fontSize);

        const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
        if (
          dropsRef.current[i] * fontSize > canvasHeight &&
          Math.random() > 0.975
        ) {
          dropsRef.current[i] = -Math.floor(Math.random() * 20);
        }
        dropsRef.current[i] += speed;
      }

      // Update performance metrics
      const renderTime = performance.now() - renderStartRef.current;
      updateRenderTime(renderTime);

      animationRef.current = requestAnimationFrame(draw);
    };

    // Register with performance manager
    register(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      window.removeEventListener('resize', resizeCanvas);
    });

    // Start animation
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      unregister();
    };
  }, [
    color,
    fontSize,
    speed,
    delay,
    reset,
    isActive,
    isTabActive,
    optimalFrameRate,
    optimalQuality,
    shouldReduceMotion,
    register,
    unregister,
    updateRenderTime,
    chars,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default HackerBackground;

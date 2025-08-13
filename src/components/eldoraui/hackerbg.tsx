'use client';
import React, { useEffect, useRef } from 'react';

interface HackerBackgroundProps {
  color?: string;
  fontSize?: number;
  className?: string;
  speed?: number;
  delay?: number;
  reset?: boolean;
}

const HackerBackground: React.FC<HackerBackgroundProps> = ({
  color = '#0F0',
  fontSize = 14,
  className = '',
  speed = 1,
  delay = 0,
  reset = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let startTime: number | null = null;

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns)
      .fill(0)
      .map(() => -Math.floor(Math.random() * 50));

    const resetDrops = () => {
      for (let i = 0; i < drops.length; i++) {
        drops[i] = -Math.floor(Math.random() * 50);
      }
    };

    if (reset) {
      resetDrops();
    }

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+';

    let lastTime = 0;
    const interval = 33; // ~30 fps

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (startTime === null) {
        startTime = currentTime;
      }

      if (currentTime - startTime < delay * 1000) {
        return;
      }

      if (currentTime - lastTime < interval) return;
      lastTime = currentTime;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = -Math.floor(Math.random() * 20);
        }
        drops[i] += speed; // Use the speed prop to control fall rate
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, fontSize, speed, delay, reset]);

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

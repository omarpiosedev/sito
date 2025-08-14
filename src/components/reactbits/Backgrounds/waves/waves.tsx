/*Ensure you had installed the package
or read our installation document. (go to lightswind.com/components/Installation)
npm i lightswind@latest*/

'use client';
import React, {
  useEffect,
  useRef,
  useState,
  ReactElement,
  useMemo,
} from 'react';
import { useBackgroundPerformance } from '@/lib/background-performance-manager';

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution; // Canvas resolution (width, height)
uniform float iTime;       // Time in seconds since the animation started
uniform vec2 iMouse;      // Mouse coordinates (x, y)
uniform vec3 u_color;     // Custom color uniform

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (1.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.5;

    vec2 mouse_uv = (4.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);

    float mouseInfluence = 0.0;
    if (length(iMouse) > 0.0) {
        float dist_to_mouse = distance(uv, mouse_uv);
        mouseInfluence = smoothstep(0.8, 0.0, dist_to_mouse);
    }

    for(float i = 8.0; i < 20.0; i++) {
        uv.x += 0.6 / i * cos(i * 2.5 * uv.y + t);
        uv.y += 0.6 / i * cos(i * 1.5 * uv.x + t);
    }

    float wave = abs(sin(t - uv.y - uv.x + mouseInfluence * 8.0));
    float glow = smoothstep(0.9, 0.0, wave);

    vec3 color = glow * u_color; // Use the custom color here

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

/**
 * Valid blur sizes supported by Tailwind CSS.
 */
export type BlurSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * @typedef {Object} ShaderBackgroundProps
 * @property {BlurSize} [backdropBlurAmount] - The size of the backdrop blur to apply.
 * Valid values are "none", "sm", "md", "lg", "xl", "2xl", "3xl".
 * Defaults to "sm" if not provided.
 * @property {string} [color] - The color of the shader's glow in hexadecimal format (e.g., "#RRGGBB").
 * Defaults to "#471CE2" (purple) if not provided.
 * @property {string} [className] - Additional CSS classes to apply to the container div.
 */
interface ShaderBackgroundProps {
  backdropBlurAmount?: string; // Accept any string from UI (validated internally)
  color?: string;
  className?: string;
  priority?: number;
}

/**
 * A mapping from simplified blur size names to full Tailwind CSS backdrop-blur classes.
 * This ensures Tailwind's JIT mode can correctly detect and generate the CSS.
 */
const blurClassMap: Record<BlurSize, string> = {
  none: 'backdrop-blur-none',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
  '3xl': 'backdrop-blur-3xl',
};

/**
 * A React component that renders an interactive WebGL shader background.
 * The background features a turbulent, glowing wave pattern that responds to mouse movement.
 * An optional backdrop blur can be applied over the shader.
 *
 * @param {ShaderBackgroundProps} props - The component props.
 * @returns {JSX.Element} The rendered ShaderBackground component.
 */
function ShaderBackground({
  backdropBlurAmount = 'sm',
  color = '#07eae6ff', // Default purple color
  className = '',
  priority = 7,
}: ShaderBackgroundProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  // Visibility state managed by performance manager
  // const [isVisible, setIsVisible] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);

  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const mouseDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const renderStartRef = useRef(0);

  // Generate unique ID for this instance
  const instanceId = useMemo(
    () => `waves-bg-${Math.random().toString(36).substr(2, 9)}`,
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
  } = useBackgroundPerformance(instanceId, 'webgl', priority);

  // Helper to convert hex color to RGB (0-1 range)
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };

  // Visibility detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = createVisibilityObserver();
    if (!observer) return; // Handle SSR case

    observer.observe(canvas);

    return () => observer.disconnect();
  }, [createVisibilityObserver]);

  // Tab visibility detection
  useEffect(() => {
    // Only run in browser environment
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const compileShader = (
      type: number,
      source: string
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');
    const iMouseLocation = gl.getUniformLocation(program, 'iMouse');
    const uColorLocation = gl.getUniformLocation(program, 'u_color'); // Get uniform location for custom color

    const startTime = Date.now();

    // Set the initial color
    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);

    const render = (timestamp: number) => {
      // Performance tracking
      renderStartRef.current = performance.now();

      // Check if should render based on performance manager
      if (!isActive() || !isTabActive || shouldReduceMotion()) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      // Dynamic frame rate based on performance
      const targetInterval = 1000 / optimalFrameRate();
      const deltaTime = timestamp - lastFrameTimeRef.current;

      if (deltaTime < targetInterval) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      lastFrameTimeRef.current = timestamp;

      const quality = optimalQuality();
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Only resize if dimensions changed and adapt to quality
      const dpr = Math.min(window.devicePixelRatio || 1, quality * 2);
      const scaledWidth = Math.floor(width * dpr);
      const scaledHeight = Math.floor(height * dpr);

      if (
        lastSizeRef.current.width !== scaledWidth ||
        lastSizeRef.current.height !== scaledHeight
      ) {
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        lastSizeRef.current = { width: scaledWidth, height: scaledHeight };
        gl.viewport(0, 0, scaledWidth, scaledHeight);
      }

      const currentTime = (Date.now() - startTime) / 1000;

      gl.uniform2f(iResolutionLocation, scaledWidth, scaledHeight);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(
        iMouseLocation,
        isHovering ? mousePosition.x * dpr : 0,
        isHovering ? (height - mousePosition.y) * dpr : 0
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Update performance metrics
      const renderTime = performance.now() - renderStartRef.current;
      updateRenderTime(renderTime);

      animationRef.current = requestAnimationFrame(render);
    };

    // Performance: Debounced mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseDebounceRef.current) {
        clearTimeout(mouseDebounceRef.current);
      }

      mouseDebounceRef.current = setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }, 16); // ~60fps debouncing
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Register with performance manager
    register(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (mouseDebounceRef.current) {
        clearTimeout(mouseDebounceRef.current);
        mouseDebounceRef.current = null;
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    });

    // Start rendering
    animationRef.current = requestAnimationFrame(render);

    return () => {
      unregister();
    };
  }, [
    isHovering,
    mousePosition,
    color,
    isActive,
    isTabActive,
    optimalFrameRate,
    optimalQuality,
    shouldReduceMotion,
    register,
    unregister,
    updateRenderTime,
  ]);

  // Get the correct Tailwind CSS class from the map
  const finalBlurClass =
    blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap['sm'];

  return (
    <div className={`w-full max-w-screen h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full max-w-screen h-full overflow-hidden"
        style={{ display: 'block' }}
      />
      {/* Apply the mapped Tailwind CSS class for backdrop blur */}
      <div className={`absolute inset-0 ${finalBlurClass}`}></div>
    </div>
  );
}

export default ShaderBackground;

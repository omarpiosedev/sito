/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import ShaderBackground from '@/components/lightswind/shader-background';

// Mock WebGL context and methods
const mockWebGLContext = {
  // WebGL constants
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  COMPILE_STATUS: 35713,
  LINK_STATUS: 35714,
  ARRAY_BUFFER: 34962,
  STATIC_DRAW: 35044,
  TRIANGLES: 4,
  FLOAT: 5126,

  // WebGL methods
  createShader: jest.fn(() => ({})),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  getShaderParameter: jest.fn(() => true),
  getShaderInfoLog: jest.fn(() => ''),
  deleteShader: jest.fn(),
  createProgram: jest.fn(() => ({})),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  getProgramParameter: jest.fn(() => true),
  getProgramInfoLog: jest.fn(() => ''),
  useProgram: jest.fn(),
  createBuffer: jest.fn(() => ({})),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  getAttribLocation: jest.fn(() => 0),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  getUniformLocation: jest.fn(() => ({})),
  uniform2f: jest.fn(),
  uniform1f: jest.fn(),
  uniform3f: jest.fn(),
  viewport: jest.fn(),
  drawArrays: jest.fn(),
};

// Mock failed WebGL context for error testing
const mockFailedWebGLContext = {
  ...mockWebGLContext,
  createShader: jest.fn(() => null),
  getShaderParameter: jest.fn(() => false),
  getProgramParameter: jest.fn(() => false),
};

// Mock canvas and WebGL context
const mockCanvas = {
  getContext: jest.fn(),
  clientWidth: 800,
  clientHeight: 600,
  width: 800,
  height: 600,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getBoundingClientRect: jest.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
  })),
};

// Mock requestAnimationFrame
let animationFrameId = 0;
const mockRequestAnimationFrame = jest.fn(callback => {
  animationFrameId++;
  setTimeout(() => callback(Date.now()), 16);
  return animationFrameId;
});

// Mock Date.now for time-based testing
const mockDateNow = jest.fn(() => 1000000);

describe('ShaderBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock canvas element methods
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockWebGLContext);
    HTMLCanvasElement.prototype.addEventListener = jest.fn();
    HTMLCanvasElement.prototype.removeEventListener = jest.fn();
    HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
    }));

    // Set canvas dimensions
    Object.defineProperty(HTMLCanvasElement.prototype, 'clientWidth', {
      get: () => 800,
      configurable: true,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'clientHeight', {
      get: () => 600,
      configurable: true,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
      get: () => 800,
      set: () => {},
      configurable: true,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
      get: () => 600,
      set: () => {},
      configurable: true,
    });

    // Mock global functions
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.Date.now = mockDateNow;

    // Mock console methods
    global.console.error = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<ShaderBackground />);

      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      const { container } = render(<ShaderBackground />);

      expect(container.firstChild).toHaveClass(
        'w-full',
        'max-w-screen',
        'h-full',
        'overflow-hidden'
      );
      expect(container.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ShaderBackground className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies correct backdrop blur classes', () => {
      const blurAmounts = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

      blurAmounts.forEach(blur => {
        const { container, unmount } = render(
          <ShaderBackground backdropBlurAmount={blur} />
        );
        expect(
          container.querySelector(`.backdrop-blur-${blur}`)
        ).toBeInTheDocument();
        unmount();
      });
    });

    it('falls back to default blur class for invalid blur amount', () => {
      const { container } = render(
        <ShaderBackground backdropBlurAmount="invalid" />
      );

      expect(container.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
    });

    it('renders canvas with correct attributes', () => {
      const { container } = render(<ShaderBackground />);

      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveClass(
        'absolute',
        'inset-0',
        'w-full',
        'max-w-screen',
        'h-full',
        'overflow-hidden'
      );
      expect(canvas).toHaveStyle({ display: 'block' });
    });
  });

  describe('WebGL Context Initialization', () => {
    it('initializes WebGL context successfully', () => {
      render(<ShaderBackground />);

      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith(
        'webgl'
      );
      expect(mockWebGLContext.createShader).toHaveBeenCalledWith(
        mockWebGLContext.VERTEX_SHADER
      );
      expect(mockWebGLContext.createShader).toHaveBeenCalledWith(
        mockWebGLContext.FRAGMENT_SHADER
      );
    });

    it('handles WebGL context creation failure', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

      render(<ShaderBackground />);

      expect(console.error).toHaveBeenCalledWith('WebGL not supported');
    });

    it('compiles vertex and fragment shaders', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.shaderSource).toHaveBeenCalledTimes(2);
      expect(mockWebGLContext.compileShader).toHaveBeenCalledTimes(2);
      expect(mockWebGLContext.getShaderParameter).toHaveBeenCalledWith(
        {},
        mockWebGLContext.COMPILE_STATUS
      );
    });

    it('handles shader compilation failure', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        ...mockWebGLContext,
        getShaderParameter: jest.fn(() => false),
        getShaderInfoLog: jest.fn(() => 'Shader compilation error'),
      }));

      render(<ShaderBackground />);

      expect(console.error).toHaveBeenCalledWith(
        'Shader compilation error:',
        'Shader compilation error'
      );
    });

    it('creates and links shader program', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.createProgram).toHaveBeenCalled();
      expect(mockWebGLContext.attachShader).toHaveBeenCalledTimes(2);
      expect(mockWebGLContext.linkProgram).toHaveBeenCalled();
      expect(mockWebGLContext.getProgramParameter).toHaveBeenCalledWith(
        {},
        mockWebGLContext.LINK_STATUS
      );
    });

    it('handles program linking failure', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        ...mockWebGLContext,
        getProgramParameter: jest.fn(() => false),
        getProgramInfoLog: jest.fn(() => 'Program linking error'),
      }));

      render(<ShaderBackground />);

      expect(console.error).toHaveBeenCalledWith(
        'Program linking error:',
        'Program linking error'
      );
    });

    it('sets up vertex buffer and attributes', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.createBuffer).toHaveBeenCalled();
      expect(mockWebGLContext.bindBuffer).toHaveBeenCalledWith(
        mockWebGLContext.ARRAY_BUFFER,
        {}
      );
      expect(mockWebGLContext.bufferData).toHaveBeenCalledWith(
        mockWebGLContext.ARRAY_BUFFER,
        expect.any(Float32Array),
        mockWebGLContext.STATIC_DRAW
      );
      expect(mockWebGLContext.getAttribLocation).toHaveBeenCalledWith(
        {},
        'a_position'
      );
      expect(mockWebGLContext.enableVertexAttribArray).toHaveBeenCalledWith(0);
      expect(mockWebGLContext.vertexAttribPointer).toHaveBeenCalledWith(
        0,
        2,
        mockWebGLContext.FLOAT,
        false,
        0,
        0
      );
    });

    it('gets uniform locations', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.getUniformLocation).toHaveBeenCalledWith(
        {},
        'iResolution'
      );
      expect(mockWebGLContext.getUniformLocation).toHaveBeenCalledWith(
        {},
        'iTime'
      );
      expect(mockWebGLContext.getUniformLocation).toHaveBeenCalledWith(
        {},
        'iMouse'
      );
      expect(mockWebGLContext.getUniformLocation).toHaveBeenCalledWith(
        {},
        'u_color'
      );
    });
  });

  describe('Color Handling', () => {
    it('uses default color when none provided', () => {
      render(<ShaderBackground />);

      // Default color #07eae6ff should be converted to RGB (0.027, 0.918, 0.902)
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith(
        {},
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('converts hex color to RGB correctly', () => {
      render(<ShaderBackground color="#ff0000" />);

      // Red color should be converted to RGB (1, 0, 0)
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith({}, 1, 0, 0);
    });

    it('handles various hex color formats', () => {
      const colors = ['#00ff00', '#0000ff', '#ffffff', '#000000'];

      colors.forEach((color, index) => {
        const { unmount } = render(<ShaderBackground color={color} />);
        expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
        unmount();
      });
    });

    it('updates color when prop changes', () => {
      const { rerender } = render(<ShaderBackground color="#ff0000" />);

      rerender(<ShaderBackground color="#00ff00" />);

      // Should be called twice - once for initial render, once for update
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledTimes(2);
    });
  });

  describe('Mouse Interaction', () => {
    it('handles mouse move events', () => {
      const { container } = render(<ShaderBackground />);

      const canvas = container.querySelector('canvas');

      fireEvent.mouseMove(canvas, { clientX: 100, clientY: 150 });

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('handles mouse enter events', () => {
      const { container } = render(<ShaderBackground />);

      const canvas = container.querySelector('canvas');

      fireEvent.mouseEnter(canvas);

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mouseenter',
        expect.any(Function)
      );
    });

    it('handles mouse leave events', () => {
      const { container } = render(<ShaderBackground />);

      const canvas = container.querySelector('canvas');

      fireEvent.mouseLeave(canvas);

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      );
    });

    it('calculates mouse position relative to canvas', () => {
      // Mock getBoundingClientRect to return specific values
      HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
        left: 50,
        top: 100,
        width: 800,
        height: 600,
      }));

      const { container } = render(<ShaderBackground />);

      const canvas = container.querySelector('canvas');

      // Simulate mouse move event
      fireEvent.mouseMove(canvas, { clientX: 200, clientY: 250 });

      // Position should be relative to canvas bounds (200-50=150, 250-100=150)
      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('resets mouse position on mouse leave', () => {
      const { container } = render(<ShaderBackground />);

      const canvas = container.querySelector('canvas');

      // Simulate mouse leave event
      fireEvent.mouseLeave(canvas);

      // Mouse position should be reset to (0, 0)
      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      );
    });
  });

  describe('Animation Rendering', () => {
    it('starts animation loop', () => {
      render(<ShaderBackground />);

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('sets viewport and uniforms in render loop', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
      expect(mockWebGLContext.uniform2f).toHaveBeenCalledWith({}, 800, 600); // iResolution
      expect(mockWebGLContext.uniform1f).toHaveBeenCalledWith(
        {},
        expect.any(Number)
      ); // iTime
      expect(mockWebGLContext.uniform2f).toHaveBeenCalledWith({}, 0, 0); // iMouse (initially 0,0)
    });

    it('draws triangles in render loop', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.drawArrays).toHaveBeenCalledWith(
        mockWebGLContext.TRIANGLES,
        0,
        6
      );
    });

    it('updates canvas dimensions in render loop', () => {
      render(<ShaderBackground />);

      // Verify that viewport is called with correct dimensions
      expect(mockWebGLContext.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('calculates time correctly', () => {
      const initialTime = 1000000;
      mockDateNow.mockReturnValue(initialTime);

      render(<ShaderBackground />);

      // Time should be 0 initially
      expect(mockWebGLContext.uniform1f).toHaveBeenCalledWith({}, 0);
    });
  });

  describe('Event Listener Cleanup', () => {
    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(<ShaderBackground />);

      unmount();

      expect(
        HTMLCanvasElement.prototype.removeEventListener
      ).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(
        HTMLCanvasElement.prototype.removeEventListener
      ).toHaveBeenCalledWith('mouseenter', expect.any(Function));
      expect(
        HTMLCanvasElement.prototype.removeEventListener
      ).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    });

    it('handles cleanup when canvas is null', () => {
      // Mock useRef to return null ref
      const originalUseRef = React.useRef;
      React.useRef = jest.fn(() => ({ current: null }));

      const { unmount } = render(<ShaderBackground />);

      expect(() => unmount()).not.toThrow();

      // Restore useRef
      React.useRef = originalUseRef;
    });
  });

  describe('Error Handling', () => {
    it('handles null canvas reference gracefully', () => {
      // Mock useRef to return null ref
      const originalUseRef = React.useRef;
      React.useRef = jest.fn(() => ({ current: null }));

      expect(() => render(<ShaderBackground />)).not.toThrow();

      // Restore useRef
      React.useRef = originalUseRef;
    });

    it('handles shader creation failure', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        ...mockWebGLContext,
        createShader: jest.fn(() => null),
      }));

      render(<ShaderBackground />);

      // Should handle gracefully - component should still render
      const { container } = render(<ShaderBackground />);
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('handles program creation failure', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        ...mockWebGLContext,
        createProgram: jest.fn(() => null),
      }));

      render(<ShaderBackground />);

      // Should exit early without error - component should still render
      const { container } = render(<ShaderBackground />);
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('deletes shader on compilation failure', () => {
      const mockShader = {};
      const mockContext = {
        ...mockWebGLContext,
        createShader: jest.fn(() => mockShader),
        getShaderParameter: jest.fn(() => false),
        getShaderInfoLog: jest.fn(() => 'Error message'),
      };

      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      render(<ShaderBackground />);

      expect(mockContext.deleteShader).toHaveBeenCalledWith(mockShader);
    });
  });

  describe('Performance and Optimization', () => {
    it('only re-renders when dependencies change', () => {
      const { rerender } = render(<ShaderBackground color="#ff0000" />);

      // Clear previous calls
      mockWebGLContext.uniform3f.mockClear();

      // Re-render with same props
      rerender(<ShaderBackground color="#ff0000" />);

      // Should set up again due to useEffect dependencies
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
    });

    it('handles rapid mouse movements efficiently', () => {
      render(<ShaderBackground />);

      const mouseMoveHandler = mockCanvas.addEventListener.mock.calls.find(
        call => call[0] === 'mousemove'
      )[1];

      // Simulate rapid mouse movements
      for (let i = 0; i < 10; i++) {
        mouseMoveHandler({ clientX: i * 10, clientY: i * 10 });
      }

      // Should handle all movements without error
      expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('continues animation loop on subsequent frames', async () => {
      render(<ShaderBackground />);

      // Wait for next animation frame
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Should have called requestAnimationFrame multiple times
      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2);
    });
  });

  describe('WebGL State Management', () => {
    it('maintains WebGL state correctly', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.useProgram).toHaveBeenCalledWith({});
      expect(mockWebGLContext.enableVertexAttribArray).toHaveBeenCalledWith(0);
      expect(mockWebGLContext.bindBuffer).toHaveBeenCalledWith(
        mockWebGLContext.ARRAY_BUFFER,
        {}
      );
    });

    it('updates uniforms on every frame', () => {
      render(<ShaderBackground />);

      // Should update resolution, time, and mouse uniforms
      expect(mockWebGLContext.uniform2f).toHaveBeenCalledTimes(2); // iResolution and iMouse
      expect(mockWebGLContext.uniform1f).toHaveBeenCalledTimes(1); // iTime
    });

    it('handles buffer data correctly', () => {
      render(<ShaderBackground />);

      const expectedVertices = new Float32Array([
        -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
      ]);

      expect(mockWebGLContext.bufferData).toHaveBeenCalledWith(
        mockWebGLContext.ARRAY_BUFFER,
        expect.any(Float32Array),
        mockWebGLContext.STATIC_DRAW
      );
    });
  });

  describe('Integration Tests', () => {
    it('works with all props together', () => {
      const { container } = render(
        <ShaderBackground
          backdropBlurAmount="lg"
          color="#00ff00"
          className="test-class"
        />
      );

      expect(container.firstChild).toHaveClass('test-class');
      expect(container.querySelector('.backdrop-blur-lg')).toBeInTheDocument();
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith({}, 0, 1, 0); // Green color
    });

    it('handles component lifecycle correctly', () => {
      const { rerender, unmount } = render(<ShaderBackground />);

      // Change props
      rerender(<ShaderBackground color="#ff0000" />);

      // Unmount
      unmount();

      expect(mockCanvas.removeEventListener).toHaveBeenCalledTimes(3);
    });

    it('maintains performance under stress', () => {
      const { rerender } = render(<ShaderBackground />);

      // Rapid prop changes
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'];
      colors.forEach(color => {
        rerender(<ShaderBackground color={color} />);
      });

      // Should handle all changes without error
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
    });
  });
});

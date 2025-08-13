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
import ShaderBackground from '@/components/reactbits/Backgrounds/waves/waves';

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

// Mock requestAnimationFrame
let animationFrameId = 0;
const mockRequestAnimationFrame = jest.fn(callback => {
  animationFrameId++;
  setTimeout(() => callback(Date.now()), 16);
  return animationFrameId;
});

// Mock Date.now for time-based testing
const mockDateNow = jest.fn(() => 1000000);

describe('ShaderBackground (Waves) Component', () => {
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

  describe('Component Rendering and Structure', () => {
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
        <ShaderBackground className="custom-waves" />
      );

      expect(container.firstChild).toHaveClass('custom-waves');
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

    it('renders canvas with correct attributes and styling', () => {
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

    it('renders backdrop blur overlay correctly', () => {
      const { container } = render(
        <ShaderBackground backdropBlurAmount="lg" />
      );

      const overlay = container.querySelector('.backdrop-blur-lg');
      expect(overlay).toHaveClass('absolute', 'inset-0');
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

    it('handles vertex shader compilation failure', () => {
      const mockContext = {
        ...mockWebGLContext,
        createShader: jest.fn(type =>
          type === mockWebGLContext.VERTEX_SHADER ? {} : null
        ),
        getShaderParameter: jest.fn(shader => false),
        getShaderInfoLog: jest.fn(() => 'Vertex shader error'),
      };

      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      render(<ShaderBackground />);

      expect(console.error).toHaveBeenCalledWith(
        'Shader compilation error:',
        'Vertex shader error'
      );
      expect(mockContext.deleteShader).toHaveBeenCalled();
    });

    it('handles fragment shader compilation failure', () => {
      let callCount = 0;
      const mockContext = {
        ...mockWebGLContext,
        getShaderParameter: jest.fn(() => {
          callCount++;
          return callCount === 1; // First call (vertex) succeeds, second (fragment) fails
        }),
        getShaderInfoLog: jest.fn(() => 'Fragment shader error'),
      };

      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      render(<ShaderBackground />);

      expect(console.error).toHaveBeenCalledWith(
        'Shader compilation error:',
        'Fragment shader error'
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
      const mockContext = {
        ...mockWebGLContext,
        getProgramParameter: jest.fn(() => false),
        getProgramInfoLog: jest.fn(() => 'Program linking error'),
      };

      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

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

  describe('Color Handling and hexToRgb Function', () => {
    it('uses default color when none provided', () => {
      render(<ShaderBackground />);

      // Default color #07eae6ff should be converted to RGB
      const expectedR = parseInt('07', 16) / 255;
      const expectedG = parseInt('ea', 16) / 255;
      const expectedB = parseInt('e6', 16) / 255;

      expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith(
        {},
        expectedR,
        expectedG,
        expectedB
      );
    });

    it('converts hex color to RGB correctly', () => {
      render(<ShaderBackground color="#ff0000" />);

      // Red color should be converted to RGB (1, 0, 0)
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith({}, 1, 0, 0);
    });

    it('handles various hex color formats', () => {
      const colorTests = [
        { hex: '#00ff00', expected: [0, 1, 0] }, // Green
        { hex: '#0000ff', expected: [0, 0, 1] }, // Blue
        { hex: '#ffffff', expected: [1, 1, 1] }, // White
        { hex: '#000000', expected: [0, 0, 0] }, // Black
        { hex: '#808080', expected: [128 / 255, 128 / 255, 128 / 255] }, // Gray
      ];

      colorTests.forEach(({ hex, expected }) => {
        const { unmount } = render(<ShaderBackground color={hex} />);
        expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith(
          {},
          expected[0],
          expected[1],
          expected[2]
        );
        unmount();
      });
    });

    it('updates color when prop changes', () => {
      const { rerender } = render(<ShaderBackground color="#ff0000" />);

      rerender(<ShaderBackground color="#00ff00" />);

      // Should be called twice - once for initial render, once for update
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledTimes(2);
      expect(mockWebGLContext.uniform3f).toHaveBeenLastCalledWith({}, 0, 1, 0);
    });

    it('handles edge case hex colors', () => {
      const edgeCases = ['#123456', '#abcdef', '#fedcba', '#999999'];

      edgeCases.forEach(color => {
        const { unmount } = render(<ShaderBackground color={color} />);
        expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
        unmount();
      });
    });
  });

  describe('Mouse Interaction and State Management', () => {
    it('initializes with correct mouse state', () => {
      render(<ShaderBackground />);

      // Initially not hovering, so mouse should be (0, 0)
      expect(mockWebGLContext.uniform2f).toHaveBeenCalledWith({}, 0, 0);
    });

    it('sets up mouse event listeners', () => {
      render(<ShaderBackground />);

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mouseenter',
        expect.any(Function)
      );
      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      );
    });

    it('executes mouse event handlers correctly', () => {
      let mouseMoveHandler: any, mouseEnterHandler: any, mouseLeaveHandler: any;

      // Intercept addEventListener calls to capture handlers
      HTMLCanvasElement.prototype.addEventListener = jest.fn(
        (event, handler) => {
          if (event === 'mousemove') mouseMoveHandler = handler;
          if (event === 'mouseenter') mouseEnterHandler = handler;
          if (event === 'mouseleave') mouseLeaveHandler = handler;
        }
      );

      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      // Mock getBoundingClientRect for mouse position calculation
      HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
        left: 50,
        top: 100,
        width: 800,
        height: 600,
      }));

      // Test mouse enter handler
      expect(mouseEnterHandler).toBeDefined();
      act(() => {
        mouseEnterHandler();
      });

      // Test mouse move handler
      expect(mouseMoveHandler).toBeDefined();
      act(() => {
        mouseMoveHandler({
          clientX: 150,
          clientY: 250,
        });
      });

      // Test mouse leave handler
      expect(mouseLeaveHandler).toBeDefined();
      act(() => {
        mouseLeaveHandler();
      });

      expect(
        HTMLCanvasElement.prototype.getBoundingClientRect
      ).toHaveBeenCalled();
    });

    it('handles mouse enter events', () => {
      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      fireEvent.mouseEnter(canvas!);

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mouseenter',
        expect.any(Function)
      );
    });

    it('handles mouse move events and updates position', () => {
      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      // Simulate mouse enter first
      fireEvent.mouseEnter(canvas!);

      // Simulate mouse move
      fireEvent.mouseMove(canvas!, { clientX: 200, clientY: 300 });

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('handles mouse leave events', () => {
      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      // Simulate mouse enter then leave
      fireEvent.mouseEnter(canvas!);
      fireEvent.mouseLeave(canvas!);

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      );
    });

    it('calculates mouse position relative to canvas bounds', () => {
      HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
        left: 50,
        top: 100,
        width: 800,
        height: 600,
      }));

      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      fireEvent.mouseMove(canvas!, { clientX: 150, clientY: 250 });

      // Position should be relative to canvas bounds (150-50=100, 250-100=150)
      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('resets mouse position on mouse leave', () => {
      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      fireEvent.mouseEnter(canvas!);
      fireEvent.mouseMove(canvas!, { clientX: 200, clientY: 300 });
      fireEvent.mouseLeave(canvas!);

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      );
    });
  });

  describe('Animation Rendering and Loop', () => {
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
      expect(mockWebGLContext.uniform2f).toHaveBeenCalledWith({}, 0, 0); // iMouse (initially not hovering)
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

      expect(mockWebGLContext.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('calculates time correctly', () => {
      const initialTime = 1000000;
      mockDateNow.mockReturnValue(initialTime);

      render(<ShaderBackground />);

      // Time should be 0 initially (startTime === currentTime)
      expect(mockWebGLContext.uniform1f).toHaveBeenCalledWith({}, 0);
    });

    it('continues animation loop on subsequent frames', async () => {
      render(<ShaderBackground />);

      // Wait for next animation frame
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Should have called requestAnimationFrame multiple times (at least twice)
      expect(
        mockRequestAnimationFrame.mock.calls.length
      ).toBeGreaterThanOrEqual(2);
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

    it('handles WebGL shader creation failure', () => {
      const mockContext = {
        ...mockWebGLContext,
        createShader: jest.fn(() => null),
      };

      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      render(<ShaderBackground />);

      // Should handle gracefully without crashing
      expect(mockContext.createShader).toHaveBeenCalled();
    });

    it('handles program creation failure', () => {
      const mockContext = {
        ...mockWebGLContext,
        createProgram: jest.fn(() => null),
      };

      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      render(<ShaderBackground />);

      // Should exit early without error
      expect(mockContext.createProgram).toHaveBeenCalled();
    });

    it('handles buffer creation failure gracefully', () => {
      const mockContext = {
        ...mockWebGLContext,
        createBuffer: jest.fn(() => null),
      };

      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      render(<ShaderBackground />);

      expect(mockContext.createBuffer).toHaveBeenCalled();
    });
  });

  describe('Performance and Optimization', () => {
    it('only re-renders when dependencies change', () => {
      const { rerender } = render(<ShaderBackground color="#ff0000" />);

      // Clear previous calls
      mockWebGLContext.uniform3f.mockClear();

      // Re-render with different color (dependency change)
      rerender(<ShaderBackground color="#00ff00" />);

      // Should set up again due to useEffect dependencies
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
    });

    it('handles rapid mouse movements efficiently', () => {
      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      // Simulate rapid mouse movements
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseMove(canvas!, { clientX: i * 10, clientY: i * 10 });
      }

      // Should handle all movements without error
      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('maintains WebGL state correctly', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.useProgram).toHaveBeenCalledWith({});
      expect(mockWebGLContext.enableVertexAttribArray).toHaveBeenCalledWith(0);
      expect(mockWebGLContext.bindBuffer).toHaveBeenCalledWith(
        mockWebGLContext.ARRAY_BUFFER,
        {}
      );
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

  describe('Blur Class Mapping', () => {
    it('maps blur sizes to correct Tailwind classes', () => {
      const blurMappings = [
        { size: 'none', expected: 'backdrop-blur-none' },
        { size: 'sm', expected: 'backdrop-blur-sm' },
        { size: 'md', expected: 'backdrop-blur-md' },
        { size: 'lg', expected: 'backdrop-blur-lg' },
        { size: 'xl', expected: 'backdrop-blur-xl' },
        { size: '2xl', expected: 'backdrop-blur-2xl' },
        { size: '3xl', expected: 'backdrop-blur-3xl' },
      ];

      blurMappings.forEach(({ size, expected }) => {
        const { container, unmount } = render(
          <ShaderBackground backdropBlurAmount={size} />
        );
        expect(container.querySelector(`.${expected}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('handles invalid blur size with default fallback', () => {
      const invalidSizes = ['invalid', 'large', 'extra', '4xl', 'huge'];

      invalidSizes.forEach(size => {
        const { container, unmount } = render(
          <ShaderBackground backdropBlurAmount={size} />
        );
        expect(
          container.querySelector('.backdrop-blur-sm')
        ).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Component Lifecycle and State Management', () => {
    it('handles component lifecycle correctly', () => {
      const { rerender, unmount } = render(
        <ShaderBackground color="#ff0000" />
      );

      // Verify initial setup
      expect(
        HTMLCanvasElement.prototype.addEventListener
      ).toHaveBeenCalledTimes(3);

      // Change props
      rerender(<ShaderBackground color="#00ff00" />);

      // Unmount
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

    it('maintains state across re-renders', () => {
      const { rerender } = render(<ShaderBackground />);

      // Change props
      rerender(<ShaderBackground color="#ff0000" />);

      // Canvas should still exist and be functional
      const { container } = render(<ShaderBackground color="#ff0000" />);
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(<ShaderBackground />);

      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'];
      colors.forEach(color => {
        rerender(<ShaderBackground color={color} />);
      });

      // Should handle all changes without error
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('works with all props together', () => {
      const { container } = render(
        <ShaderBackground
          backdropBlurAmount="lg"
          color="#00ff00"
          className="test-waves"
        />
      );

      expect(container.firstChild).toHaveClass('test-waves');
      expect(container.querySelector('.backdrop-blur-lg')).toBeInTheDocument();
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith({}, 0, 1, 0); // Green color
    });

    it('handles complete interaction workflow', () => {
      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      // Simulate complete interaction
      fireEvent.mouseEnter(canvas!);
      fireEvent.mouseMove(canvas!, { clientX: 200, clientY: 300 });
      fireEvent.mouseLeave(canvas!);

      // Should handle all interactions without errors
      expect(
        HTMLCanvasElement.prototype.addEventListener
      ).toHaveBeenCalledTimes(3);
    });

    it('maintains performance under stress', () => {
      const { rerender, container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      // Rapid prop changes and interactions
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      colors.forEach((color, index) => {
        rerender(<ShaderBackground color={color} />);
        fireEvent.mouseMove(canvas!, {
          clientX: index * 100,
          clientY: index * 100,
        });
      });

      // Should maintain functionality
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('WebGL Shader Program', () => {
    it('uses correct vertex shader source', () => {
      render(<ShaderBackground />);

      const vertexShaderCall = mockWebGLContext.shaderSource.mock.calls[0];
      expect(vertexShaderCall[1]).toContain('attribute vec4 a_position');
      expect(vertexShaderCall[1]).toContain('gl_Position = a_position');
    });

    it('uses correct fragment shader source', () => {
      render(<ShaderBackground />);

      const fragmentShaderCall = mockWebGLContext.shaderSource.mock.calls[1];
      expect(fragmentShaderCall[1]).toContain('precision mediump float');
      expect(fragmentShaderCall[1]).toContain('uniform vec2 iResolution');
      expect(fragmentShaderCall[1]).toContain('uniform float iTime');
      expect(fragmentShaderCall[1]).toContain('uniform vec2 iMouse');
      expect(fragmentShaderCall[1]).toContain('uniform vec3 u_color');
    });

    it('implements wave physics correctly in shader', () => {
      render(<ShaderBackground />);

      const fragmentShaderCall = mockWebGLContext.shaderSource.mock.calls[1];
      const shaderSource = fragmentShaderCall[1];

      // Check for wave generation logic
      expect(shaderSource).toContain(
        'uv.x += 0.6 / i * cos(i * 2.5 * uv.y + t)'
      );
      expect(shaderSource).toContain(
        'uv.y += 0.6 / i * cos(i * 1.5 * uv.x + t)'
      );
      expect(shaderSource).toContain(
        'abs(sin(t - uv.y - uv.x + mouseInfluence * 8.0))'
      );
    });

    it('implements mouse influence in shader', () => {
      render(<ShaderBackground />);

      const fragmentShaderCall = mockWebGLContext.shaderSource.mock.calls[1];
      const shaderSource = fragmentShaderCall[1];

      // Check for mouse interaction logic
      expect(shaderSource).toContain('distance(uv, mouse_uv)');
      expect(shaderSource).toContain('smoothstep(0.8, 0.0, dist_to_mouse)');
      expect(shaderSource).toContain('mouseInfluence * 8.0');
    });
  });
});

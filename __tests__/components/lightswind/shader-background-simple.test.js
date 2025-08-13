/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShaderBackground from '@/components/lightswind/shader-background';

// Mock WebGL context with essential methods
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

    // Mock global functions
    global.requestAnimationFrame = jest.fn(callback => {
      setTimeout(() => callback(Date.now()), 16);
      return 1;
    });
    global.Date.now = jest.fn(() => 1000000);
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

  describe('Backdrop Blur Classes', () => {
    const blurTestCases = [
      ['none', 'backdrop-blur-none'],
      ['sm', 'backdrop-blur-sm'],
      ['md', 'backdrop-blur-md'],
      ['lg', 'backdrop-blur-lg'],
      ['xl', 'backdrop-blur-xl'],
      ['2xl', 'backdrop-blur-2xl'],
      ['3xl', 'backdrop-blur-3xl'],
    ];

    blurTestCases.forEach(([input, expected]) => {
      it(`applies correct blur class for ${input}`, () => {
        const { container } = render(
          <ShaderBackground backdropBlurAmount={input} />
        );
        expect(container.querySelector(`.${expected}`)).toBeInTheDocument();
      });
    });

    it('falls back to default blur class for invalid blur amount', () => {
      const { container } = render(
        <ShaderBackground backdropBlurAmount="invalid" />
      );
      expect(container.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
    });
  });

  describe('WebGL Context Initialization', () => {
    it('attempts to get WebGL context', () => {
      render(<ShaderBackground />);
      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith(
        'webgl'
      );
    });

    it('handles WebGL context creation failure gracefully', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

      render(<ShaderBackground />);

      expect(console.error).toHaveBeenCalledWith('WebGL not supported');
    });

    it('initializes WebGL resources when context is available', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.createShader).toHaveBeenCalled();
      expect(mockWebGLContext.createProgram).toHaveBeenCalled();
      expect(mockWebGLContext.createBuffer).toHaveBeenCalled();
    });

    it('compiles shaders', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.shaderSource).toHaveBeenCalled();
      expect(mockWebGLContext.compileShader).toHaveBeenCalled();
      expect(mockWebGLContext.getShaderParameter).toHaveBeenCalled();
    });

    it('creates and links shader program', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.attachShader).toHaveBeenCalled();
      expect(mockWebGLContext.linkProgram).toHaveBeenCalled();
      expect(mockWebGLContext.getProgramParameter).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles shader compilation failure', () => {
      const mockContext = {
        ...mockWebGLContext,
        getShaderParameter: jest.fn(() => false),
        getShaderInfoLog: jest.fn(() => 'Compilation error'),
      };
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      render(<ShaderBackground />);

      expect(console.error).toHaveBeenCalledWith(
        'Shader compilation error:',
        'Compilation error'
      );
      expect(mockContext.deleteShader).toHaveBeenCalled();
    });

    it('handles program linking failure', () => {
      const mockContext = {
        ...mockWebGLContext,
        getProgramParameter: jest.fn(() => false),
        getProgramInfoLog: jest.fn(() => 'Linking error'),
      };
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      render(<ShaderBackground />);

      expect(console.error).toHaveBeenCalledWith(
        'Program linking error:',
        'Linking error'
      );
    });

    it('handles null shader creation', () => {
      const mockContext = {
        ...mockWebGLContext,
        createShader: jest.fn(() => null),
      };
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      expect(() => render(<ShaderBackground />)).not.toThrow();
    });

    it('handles null program creation', () => {
      const mockContext = {
        ...mockWebGLContext,
        createProgram: jest.fn(() => null),
      };
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

      expect(() => render(<ShaderBackground />)).not.toThrow();
    });
  });

  describe('Color Handling', () => {
    it('converts hex colors to RGB correctly', () => {
      render(<ShaderBackground color="#ff0000" />);

      // Red color (255, 0, 0) should be normalized to (1, 0, 0)
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith({}, 1, 0, 0);
    });

    it('handles default color', () => {
      render(<ShaderBackground />);

      // Should call uniform3f with some color values
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
    });

    it('converts various hex colors correctly', () => {
      const testCases = [
        ['#00ff00', [0, 1, 0]], // Green
        ['#0000ff', [0, 0, 1]], // Blue
        ['#ffffff', [1, 1, 1]], // White
        ['#000000', [0, 0, 0]], // Black
      ];

      testCases.forEach(([hex, [r, g, b]]) => {
        const { unmount } = render(<ShaderBackground color={hex} />);
        expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith({}, r, g, b);
        unmount();
        mockWebGLContext.uniform3f.mockClear();
      });
    });
  });

  describe('Mouse Interaction', () => {
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

    it('responds to mouse events', () => {
      const { container } = render(<ShaderBackground />);
      const canvas = container.querySelector('canvas');

      // Mouse events should not throw errors
      expect(() => {
        fireEvent.mouseMove(canvas, { clientX: 100, clientY: 150 });
        fireEvent.mouseEnter(canvas);
        fireEvent.mouseLeave(canvas);
      }).not.toThrow();
    });

    it('handles mouse move and calculates position', () => {
      // Mock getBoundingClientRect to return specific bounds
      HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
        left: 50,
        top: 100,
        width: 800,
        height: 600,
      }));

      // Capture the mouse move handler by intercepting addEventListener
      let mouseMoveHandler = null;
      HTMLCanvasElement.prototype.addEventListener = jest.fn(
        (event, handler) => {
          if (event === 'mousemove') {
            mouseMoveHandler = handler;
          }
        }
      );

      render(<ShaderBackground />);

      // Simulate mouse move event through the handler
      if (mouseMoveHandler) {
        mouseMoveHandler({
          clientX: 200,
          clientY: 250,
        });
      }

      // The handler should have executed without error
      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalled();
    });

    it('handles mouse enter event', () => {
      let mouseEnterHandler = null;
      HTMLCanvasElement.prototype.addEventListener = jest.fn(
        (event, handler) => {
          if (event === 'mouseenter') {
            mouseEnterHandler = handler;
          }
        }
      );

      render(<ShaderBackground />);

      // Simulate mouse enter event
      if (mouseEnterHandler) {
        mouseEnterHandler();
      }

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalled();
    });

    it('handles mouse leave event', () => {
      let mouseLeaveHandler = null;
      HTMLCanvasElement.prototype.addEventListener = jest.fn(
        (event, handler) => {
          if (event === 'mouseleave') {
            mouseLeaveHandler = handler;
          }
        }
      );

      render(<ShaderBackground />);

      // Simulate mouse leave event
      if (mouseLeaveHandler) {
        mouseLeaveHandler();
      }

      expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalled();
    });
  });

  describe('Animation Loop', () => {
    it('starts animation loop', () => {
      render(<ShaderBackground />);

      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('sets up render uniforms', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.uniform2f).toHaveBeenCalled(); // iResolution and iMouse
      expect(mockWebGLContext.uniform1f).toHaveBeenCalled(); // iTime
      expect(mockWebGLContext.viewport).toHaveBeenCalled();
      expect(mockWebGLContext.drawArrays).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('removes event listeners on unmount', () => {
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

    it('handles cleanup when canvas ref is null', () => {
      // Mock useRef to return null
      const originalUseRef = React.useRef;
      React.useRef = jest.fn(() => ({ current: null }));

      const { unmount } = render(<ShaderBackground />);

      expect(() => unmount()).not.toThrow();

      // Restore useRef
      React.useRef = originalUseRef;
    });
  });

  describe('Blur Class Mapping', () => {
    it('maps blur amounts to correct CSS classes', () => {
      const { container: container1 } = render(
        <ShaderBackground backdropBlurAmount="none" />
      );
      expect(
        container1.querySelector('.backdrop-blur-none')
      ).toBeInTheDocument();

      const { container: container2 } = render(
        <ShaderBackground backdropBlurAmount="xl" />
      );
      expect(container2.querySelector('.backdrop-blur-xl')).toBeInTheDocument();

      const { container: container3 } = render(
        <ShaderBackground backdropBlurAmount="3xl" />
      );
      expect(
        container3.querySelector('.backdrop-blur-3xl')
      ).toBeInTheDocument();
    });
  });

  describe('Hex to RGB Conversion', () => {
    it('correctly parses 6-digit hex colors', () => {
      // Test the hex parsing logic indirectly through color setting
      render(<ShaderBackground color="#ff8000" />); // Orange

      // Orange: R=255 (1.0), G=128 (0.502), B=0 (0.0)
      expect(mockWebGLContext.uniform3f).toHaveBeenCalledWith(
        {},
        1,
        expect.closeTo(0.502, 2),
        0
      );
    });

    it('handles edge cases in hex parsing', () => {
      const { unmount: unmount1 } = render(
        <ShaderBackground color="#123456" />
      );
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
      unmount1();

      const { unmount: unmount2 } = render(
        <ShaderBackground color="#abcdef" />
      );
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
      unmount2();
    });
  });

  describe('Buffer Management', () => {
    it('creates and binds vertex buffer', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.createBuffer).toHaveBeenCalled();
      expect(mockWebGLContext.bindBuffer).toHaveBeenCalledWith(
        mockWebGLContext.ARRAY_BUFFER,
        {}
      );
    });

    it('sets up vertex attributes', () => {
      render(<ShaderBackground />);

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

    it('uploads vertex data', () => {
      render(<ShaderBackground />);

      expect(mockWebGLContext.bufferData).toHaveBeenCalledWith(
        mockWebGLContext.ARRAY_BUFFER,
        expect.any(Float32Array),
        mockWebGLContext.STATIC_DRAW
      );
    });
  });

  describe('Uniform Locations', () => {
    it('gets all required uniform locations', () => {
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

  describe('Integration', () => {
    it('works with all props combined', () => {
      const { container } = render(
        <ShaderBackground
          backdropBlurAmount="lg"
          color="#00aa00"
          className="test-integration"
        />
      );

      expect(container.firstChild).toHaveClass('test-integration');
      expect(container.querySelector('.backdrop-blur-lg')).toBeInTheDocument();
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('handles component re-renders', () => {
      const { rerender } = render(<ShaderBackground color="#ff0000" />);

      rerender(<ShaderBackground color="#00ff00" />);
      rerender(<ShaderBackground color="#0000ff" />);

      // Should handle multiple re-renders without errors
      expect(mockWebGLContext.uniform3f).toHaveBeenCalled();
    });
  });
});

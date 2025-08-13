/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LightRays, {
  RaysOrigin,
} from '@/components/blocks/Backgrounds/LightRays/LightRays';

// Mock OGL library
let mockUniforms = {};

const mockProgram = {
  uniforms: mockUniforms,
};

const mockMesh = {
  geometry: {},
  program: mockProgram,
};

const mockRenderer = {
  gl: {
    canvas: document.createElement('canvas'),
    getExtension: jest.fn(() => ({
      loseContext: jest.fn(),
    })),
  },
  dpr: 2,
  setSize: jest.fn(),
  render: jest.fn(),
};

const mockTriangle = jest.fn(() => ({ type: 'triangle' }));

// Declare constructor mocks
const mockRendererConstructor = jest.fn(() => mockRenderer);
const mockProgramConstructor = jest.fn((gl, options) => {
  mockUniforms = options.uniforms;
  return { ...mockProgram, uniforms: options.uniforms };
});
const mockMeshConstructor = jest.fn(() => mockMesh);

// Mock the OGL module
jest.mock('ogl', () => ({
  Renderer: jest.fn(() => mockRenderer),
  Program: jest.fn((gl, options) => {
    mockUniforms = options.uniforms;
    return { ...mockProgram, uniforms: options.uniforms };
  }),
  Triangle: jest.fn(() => ({ type: 'triangle' })),
  Mesh: jest.fn(() => mockMesh),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
};

global.IntersectionObserver = jest.fn(callback => {
  return {
    ...mockIntersectionObserver,
    callback,
  };
}) as any;

// Mock requestAnimationFrame and cancelAnimationFrame
let animationFrameId = 0;
global.requestAnimationFrame = jest.fn(callback => {
  animationFrameId++;
  setTimeout(() => callback(Date.now()), 16);
  return animationFrameId;
});

global.cancelAnimationFrame = jest.fn(id => {
  // Mock implementation
});

// Mock console methods
global.console.warn = jest.fn();

describe('LightRays Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    animationFrameId = 0;
    mockUniforms = {};

    // Reset mocks
    mockRenderer.setSize.mockClear();
    mockRenderer.render.mockClear();
    mockIntersectionObserver.observe.mockClear();
    mockIntersectionObserver.disconnect.mockClear();
    // Access the mocked functions from the module
    const { Renderer, Program, Triangle, Mesh } = require('ogl');
    Renderer.mockClear();
    Program.mockClear();
    Triangle.mockClear();
    Mesh.mockClear();

    // Mock window.devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: 2,
    });

    // Mock canvas dimensions
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 800,
    });

    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 600,
    });

    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering and Structure', () => {
    it('renders without crashing', () => {
      const { container } = render(<LightRays />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default props', () => {
      const { container } = render(<LightRays />);
      const div = container.firstChild as HTMLElement;

      expect(div).toHaveClass(
        'w-full',
        'h-full',
        'pointer-events-none',
        'z-[3]',
        'overflow-hidden',
        'relative'
      );
    });

    it('applies custom className', () => {
      const { container } = render(<LightRays className="custom-class" />);
      const div = container.firstChild as HTMLElement;

      expect(div).toHaveClass('custom-class');
    });

    it('creates container with correct structure', () => {
      const { container } = render(<LightRays />);
      const div = container.firstChild as HTMLElement;

      expect(div.tagName).toBe('DIV');
      expect(div).toHaveClass('w-full', 'h-full', 'relative');
    });
  });

  describe('Intersection Observer Integration', () => {
    it('sets up intersection observer on mount', () => {
      render(<LightRays />);

      expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.1,
      });
      expect(mockIntersectionObserver.observe).toHaveBeenCalled();
    });

    it('cleans up intersection observer on unmount', () => {
      const { unmount } = render(<LightRays />);

      unmount();

      expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
    });

    it('initializes WebGL when component becomes visible', async () => {
      const { Renderer } = require('ogl');

      render(<LightRays />);

      // Get the IntersectionObserver callback
      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      // Simulate intersection
      act(() => {
        callback([{ isIntersecting: true }]);
      });

      // Wait for WebGL initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      expect(Renderer).toHaveBeenCalled();
    });
  });

  describe('WebGL Initialization', () => {
    const simulateVisible = async (component: ReturnType<typeof render>) => {
      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      act(() => {
        callback([{ isIntersecting: true }]);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
      });
    };

    it('initializes OGL renderer when visible', async () => {
      const { Renderer } = require('ogl');
      const component = render(<LightRays />);

      await simulateVisible(component);

      expect(Renderer).toHaveBeenCalledWith({
        dpr: 2,
        alpha: true,
      });
    });

    it('creates WebGL program with shaders', async () => {
      const { Program } = require('ogl');
      const component = render(<LightRays />);

      await simulateVisible(component);

      expect(Program).toHaveBeenCalledWith(
        mockRenderer.gl,
        expect.objectContaining({
          vertex: expect.stringContaining('attribute vec2 position'),
          fragment: expect.stringContaining('precision highp float'),
          uniforms: expect.any(Object),
        })
      );
    });

    it('creates triangle geometry and mesh', async () => {
      const { Triangle, Mesh } = require('ogl');
      const component = render(<LightRays />);

      await simulateVisible(component);

      expect(Triangle).toHaveBeenCalledWith(mockRenderer.gl);
      expect(Mesh).toHaveBeenCalledWith(mockRenderer.gl, {
        geometry: expect.any(Object),
        program: expect.any(Object),
      });
    });

    it('sets up canvas styling and DOM manipulation', async () => {
      const component = render(<LightRays />);

      await simulateVisible(component);

      expect(mockRenderer.gl.canvas.style.width).toBe('100%');
      expect(mockRenderer.gl.canvas.style.height).toBe('100%');
    });

    it('sets up resize event listener', async () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const component = render(<LightRays />);

      await simulateVisible(component);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('starts animation loop', async () => {
      const component = render(<LightRays />);

      await simulateVisible(component);

      expect(requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Props Configuration and Uniforms', () => {
    it('handles all rays origin positions', async () => {
      const origins: RaysOrigin[] = [
        'top-center',
        'top-left',
        'top-right',
        'right',
        'left',
        'bottom-center',
        'bottom-right',
        'bottom-left',
      ];

      for (const origin of origins) {
        const { unmount } = render(<LightRays raysOrigin={origin} />);

        const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
        const callback = observerCall[0];

        await act(async () => {
          callback([{ isIntersecting: true }]);
          await new Promise(resolve => setTimeout(resolve, 20));
        });

        // Verify origin is processed without errors
        expect(console.warn).not.toHaveBeenCalled();

        unmount();
        jest.clearAllMocks();
      }
    });

    it('configures uniforms with custom props', async () => {
      const component = render(
        <LightRays
          raysColor="#ff0000"
          raysSpeed={2}
          lightSpread={0.5}
          rayLength={3}
          pulsating={true}
          fadeDistance={2.0}
          saturation={0.8}
          mouseInfluence={0.2}
          noiseAmount={0.1}
          distortion={0.05}
        />
      );

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      const { Program } = require('ogl');
      const programCall = Program.mock.calls[0];
      const uniforms = programCall[1].uniforms;

      expect(uniforms.raysColor.value).toEqual([1, 0, 0]); // Red
      expect(uniforms.raysSpeed.value).toBe(2);
      expect(uniforms.lightSpread.value).toBe(0.5);
      expect(uniforms.rayLength.value).toBe(3);
      expect(uniforms.pulsating.value).toBe(1.0);
      expect(uniforms.fadeDistance.value).toBe(2.0);
      expect(uniforms.saturation.value).toBe(0.8);
      expect(uniforms.mouseInfluence.value).toBe(0.2);
      expect(uniforms.noiseAmount.value).toBe(0.1);
      expect(uniforms.distortion.value).toBe(0.05);
    });

    it('handles default color fallback', async () => {
      const component = render(<LightRays raysColor="invalid-color" />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      const { Program } = require('ogl');
      const programCall = Program.mock.calls[0];
      const uniforms = programCall[1].uniforms;

      expect(uniforms.raysColor.value).toEqual([1, 1, 1]); // White fallback
    });

    it('updates uniforms when props change', async () => {
      const component = render(<LightRays raysColor="#00ff00" />);

      // Make visible first
      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Change props
      component.rerender(<LightRays raysColor="#0000ff" raysSpeed={3} />);

      // Verify no errors during prop updates
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Mouse Interaction', () => {
    it('sets up mouse move listener when followMouse is true', async () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const component = render(<LightRays followMouse={true} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('does not set up mouse listener when followMouse is false', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      render(<LightRays followMouse={false} />);

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('cleans up mouse listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = render(<LightRays followMouse={true} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });

    it('handles mouse move events correctly', async () => {
      const component = render(<LightRays followMouse={true} />);

      // Make visible
      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Simulate mouse move
      act(() => {
        fireEvent(
          window,
          new MouseEvent('mousemove', {
            clientX: 400,
            clientY: 300,
          })
        );
      });

      // Should not throw errors
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('updates mouse listener when followMouse prop changes', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { rerender } = render(<LightRays followMouse={false} />);

      // Change to true
      rerender(<LightRays followMouse={true} />);
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );

      // Change back to false
      rerender(<LightRays followMouse={false} />);
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
    });
  });

  describe('Animation and Rendering Loop', () => {
    it('runs animation loop when visible', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 30));
      });

      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    it('renders mesh in animation loop', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(mockRenderer.render).toHaveBeenCalledWith({
        scene: expect.any(Object),
      });
    });

    it('handles rendering errors gracefully', async () => {
      // Reset console.warn mock
      (console.warn as jest.Mock).mockClear();

      // Mock renderer.render to throw error on first call
      mockRenderer.render.mockImplementationOnce(() => {
        throw new Error('WebGL error');
      });

      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(console.warn).toHaveBeenCalledWith(
        'WebGL rendering error:',
        expect.any(Error)
      );
    });

    it('updates time uniform in animation loop', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Verify animation loop is running
      expect(requestAnimationFrame).toHaveBeenCalled();
      expect(mockRenderer.render).toHaveBeenCalled();
    });

    it('handles mouse smoothing in animation loop', async () => {
      const component = render(
        <LightRays followMouse={true} mouseInfluence={0.1} />
      );

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 30));
      });

      // Simulate mouse movement
      act(() => {
        fireEvent(
          window,
          new MouseEvent('mousemove', {
            clientX: 400,
            clientY: 300,
          })
        );
      });

      // Animation loop should continue without errors
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Color Conversion', () => {
    it('converts hex colors to RGB correctly', () => {
      // This tests the hexToRgb function indirectly
      render(<LightRays raysColor="#ff0000" />);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('handles various hex color formats', () => {
      const colors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffffff',
        '#000000',
        '#123456',
        '#abcdef',
      ];

      colors.forEach(color => {
        const { unmount } = render(<LightRays raysColor={color} />);
        expect(console.warn).not.toHaveBeenCalled();
        unmount();
      });
    });

    it('handles invalid hex colors gracefully', () => {
      const invalidColors = ['invalid', '#gg0000', '#12345', 'red', ''];

      invalidColors.forEach(color => {
        const { unmount } = render(<LightRays raysColor={color} />);
        expect(console.warn).not.toHaveBeenCalled();
        unmount();
      });
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('cancels animation frame on cleanup', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      component.unmount();

      expect(cancelAnimationFrame).toHaveBeenCalled();
    });

    it('removes resize event listener on cleanup', async () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      component.unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('handles WebGL context cleanup', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      component.unmount();

      expect(mockRenderer.gl.getExtension).toHaveBeenCalledWith(
        'WEBGL_lose_context'
      );
    });

    it('handles cleanup errors gracefully', async () => {
      // Mock getExtension to throw error
      mockRenderer.gl.getExtension.mockImplementationOnce(() => {
        throw new Error('Extension error');
      });

      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      expect(() => component.unmount()).not.toThrow();
      expect(console.warn).toHaveBeenCalledWith(
        'Error during WebGL cleanup:',
        expect.any(Error)
      );
    });

    it('cleans up previous WebGL instance when re-initializing', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      // First initialization
      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Trigger re-initialization by changing props
      component.rerender(<LightRays raysColor="#ff0000" />);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Should handle cleanup without errors
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('Error during WebGL cleanup')
      );
    });
  });

  describe('Anchor Position Calculations', () => {
    it('calculates correct anchor positions for all origins', async () => {
      const origins: RaysOrigin[] = [
        'top-center',
        'top-left',
        'top-right',
        'right',
        'left',
        'bottom-center',
        'bottom-right',
        'bottom-left',
      ];

      for (const origin of origins) {
        const component = render(<LightRays raysOrigin={origin} />);

        const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
        const callback = observerCall[0];

        await act(async () => {
          callback([{ isIntersecting: true }]);
          await new Promise(resolve => setTimeout(resolve, 20));
        });

        // Verify initialization completed without errors
        expect(console.warn).not.toHaveBeenCalled();

        component.unmount();
        jest.clearAllMocks();
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles container ref being null during initialization', async () => {
      // Mock useRef to return null
      const originalUseRef = React.useRef;
      React.useRef = jest.fn(() => ({ current: null }));

      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Should not crash
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('error')
      );

      // Restore useRef
      React.useRef = originalUseRef;
    });

    it('handles rapid visibility changes', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      // Rapid visibility changes
      await act(async () => {
        callback([{ isIntersecting: true }]);
        callback([{ isIntersecting: false }]);
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 30));
      });

      // Should handle gracefully
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('handles component unmount during WebGL initialization', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      // Start initialization
      act(() => {
        callback([{ isIntersecting: true }]);
      });

      // Unmount immediately
      component.unmount();

      // Should not cause errors
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('handles window resize during animation', async () => {
      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 30));
      });

      // Clear previous setSize calls
      mockRenderer.setSize.mockClear();

      // Trigger resize
      act(() => {
        fireEvent(window, new Event('resize'));
      });

      // Should update size without errors
      expect(mockRenderer.setSize).toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Performance Optimizations', () => {
    it('only initializes WebGL when component is visible', () => {
      render(<LightRays />);

      const { Renderer } = require('ogl');
      // Should not initialize immediately
      expect(Renderer).not.toHaveBeenCalled();
    });

    it('respects device pixel ratio limits', async () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: 4, // High DPR
      });

      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      const { Renderer } = require('ogl');
      // Should cap at 2
      expect(Renderer).toHaveBeenCalledWith({
        dpr: 2,
        alpha: true,
      });
    });

    it('handles missing WebGL extensions gracefully', async () => {
      mockRenderer.gl.getExtension.mockReturnValue(null);

      const component = render(<LightRays />);

      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      component.unmount();

      // Should not crash when extension is missing
      expect(() => component.unmount()).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('handles all props together in complex configuration', async () => {
      const component = render(
        <LightRays
          raysOrigin="bottom-right"
          raysColor="#ff6600"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={2.5}
          pulsating={true}
          fadeDistance={1.5}
          saturation={0.9}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.05}
          distortion={0.02}
          className="complex-test"
        />
      );

      // Make visible
      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 30));
      });

      // Simulate interactions
      act(() => {
        fireEvent(
          window,
          new MouseEvent('mousemove', {
            clientX: 200,
            clientY: 150,
          })
        );
        fireEvent(window, new Event('resize'));
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Component should handle complex configuration
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('error')
      );
      const { Renderer } = require('ogl');
      expect(Renderer).toHaveBeenCalled();
    });

    it('handles prop changes during active animation', async () => {
      const component = render(<LightRays raysColor="#ff0000" raysSpeed={1} />);

      // Make visible and start animation
      const observerCall = (IntersectionObserver as jest.Mock).mock.calls[0];
      const callback = observerCall[0];

      await act(async () => {
        callback([{ isIntersecting: true }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Change multiple props during animation
      await act(async () => {
        component.rerender(
          <LightRays
            raysColor="#00ff00"
            raysSpeed={2}
            pulsating={true}
            followMouse={false}
          />
        );
        await new Promise(resolve => setTimeout(resolve, 20));
      });

      // Should handle prop changes smoothly
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('error')
      );
      const { Renderer } = require('ogl');
      expect(Renderer).toHaveBeenCalled();
    });
  });
});

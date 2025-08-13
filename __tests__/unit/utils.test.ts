import { cn } from '@/lib/utils';

describe('Utils - cn function', () => {
  describe('Basic functionality', () => {
    it('combines class names correctly', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('handles empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });

  describe('Conditional classes', () => {
    it('handles conditional class names', () => {
      const condition = true;
      const result = cn('base-class', condition && 'conditional-class');
      expect(result).toBe('base-class conditional-class');
    });

    it('filters out falsy values', () => {
      const result = cn('class1', false, null, undefined, '', 'class2');
      expect(result).toBe('class1 class2');
    });
  });

  describe('Tailwind CSS integration', () => {
    it('handles tailwind class conflicts correctly', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('handles complex tailwind classes with variants', () => {
      const result = cn(
        'bg-red-500 hover:bg-red-600',
        'bg-blue-500 hover:bg-blue-600',
        'p-4'
      );
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('hover:bg-blue-600');
      expect(result).toContain('p-4');
    });

    it('handles responsive classes', () => {
      const result = cn('text-sm', 'md:text-base', 'lg:text-lg');
      expect(result).toContain('text-sm');
      expect(result).toContain('md:text-base');
      expect(result).toContain('lg:text-lg');
    });
  });
});
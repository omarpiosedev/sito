import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles conditional class names', () => {
    const condition = true;
    const result = cn('base-class', condition && 'conditional-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('filters out falsy values', () => {
    const result = cn('class1', false, null, undefined, '', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles tailwind class conflicts correctly', () => {
    // Questo test assume che cn usi clsx e tailwind-merge
    const result = cn('text-red-500', 'text-blue-500');
    // tailwind-merge dovrebbe mantenere solo l'ultimo colore del testo
    expect(result).toBe('text-blue-500');
  });

  it('handles complex tailwind classes', () => {
    const result = cn(
      'bg-red-500 hover:bg-red-600',
      'bg-blue-500 hover:bg-blue-600',
      'p-4'
    );
    // tailwind-merge dovrebbe risolvere i conflitti mantenendo le ultime classi
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('hover:bg-blue-600');
    expect(result).toContain('p-4');
  });
});
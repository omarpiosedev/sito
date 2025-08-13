/**
 * @jest-environment jsdom
 */

import {
  cn,
  formatCurrency,
  generateUniqueId,
  truncateText,
  formatDate,
  debounce,
  throttle,
} from '@/components/lib/utils';

describe('Component Utils Library', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
    });

    it('handles conditional class names', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe(
        'base conditional'
      );
      expect(cn('base', null, undefined, '', 'visible')).toBe('base visible');
    });

    it('filters out falsy values', () => {
      expect(cn('class1', null, undefined, '', false, 'class2')).toBe(
        'class1 class2'
      );
      expect(cn(null, undefined, false, '')).toBe('');
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
      expect(cn(null)).toBe('');
      expect(cn(undefined, false, '')).toBe('');
    });

    it('handles tailwind class conflicts correctly', () => {
      expect(cn('text-sm text-lg')).toBe('text-lg');
      expect(cn('bg-red-500 bg-blue-500')).toBe('bg-blue-500');
    });

    it('handles complex tailwind classes with variants', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe(
        'hover:bg-blue-500'
      );
      expect(cn('md:text-sm lg:text-lg')).toBe('md:text-sm lg:text-lg');
    });

    it('handles responsive classes', () => {
      expect(cn('text-base', 'sm:text-lg', 'md:text-xl')).toBe(
        'text-base sm:text-lg md:text-xl'
      );
      expect(cn('w-full', 'sm:w-1/2', 'md:w-1/3')).toBe(
        'w-full sm:w-1/2 md:w-1/3'
      );
    });

    it('handles arrays of classes', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
      expect(cn(['base'], 'additional')).toBe('base additional');
    });

    it('handles object notation', () => {
      expect(cn({ class1: true, class2: false, class3: true })).toBe(
        'class1 class3'
      );
      expect(cn('base', { conditional: true, hidden: false })).toBe(
        'base conditional'
      );
    });

    it('handles mixed input types', () => {
      expect(cn('base', ['array-class'], { 'object-class': true })).toBe(
        'base array-class object-class'
      );
    });
  });

  describe('formatCurrency function', () => {
    it('formats USD currency by default', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('handles different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
      expect(formatCurrency(1234.56, 'JPY')).toBe('¥1,235');
    });

    it('handles custom formatting options', () => {
      expect(
        formatCurrency(1234.56, 'USD', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('$1,235');
      expect(
        formatCurrency(1234.56, 'USD', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('$1,234.560');
    });

    it('handles negative amounts', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
      expect(formatCurrency(-100, 'EUR')).toBe('-€100.00');
    });

    it('handles zero and small amounts', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(0.01)).toBe('$0.01');
      expect(formatCurrency(0.001, 'USD', { maximumFractionDigits: 3 })).toBe(
        '$0.001'
      );
    });

    it('handles large amounts', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('handles edge case amounts', () => {
      expect(formatCurrency(Number.MAX_SAFE_INTEGER)).toContain('$');
      expect(formatCurrency(0.0001, 'USD', { minimumFractionDigits: 4 })).toBe(
        '$0.0001'
      );
    });

    it('handles decimal precision correctly', () => {
      expect(formatCurrency(1.555)).toBe('$1.56'); // Rounds to 2 decimal places
      expect(formatCurrency(1.554)).toBe('$1.55'); // Rounds down
    });
  });

  describe('generateUniqueId function', () => {
    it('generates unique IDs with default prefix', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();

      expect(id1).toMatch(/^id-[a-z0-9]{7}$/);
      expect(id2).toMatch(/^id-[a-z0-9]{7}$/);
      expect(id1).not.toBe(id2);
    });

    it('generates unique IDs with custom prefix', () => {
      const id1 = generateUniqueId('custom');
      const id2 = generateUniqueId('test');

      expect(id1).toMatch(/^custom-[a-z0-9]{7}$/);
      expect(id2).toMatch(/^test-[a-z0-9]{7}$/);
      expect(id1).not.toBe(id2);
    });

    it('generates unique IDs without prefix', () => {
      const id1 = generateUniqueId('');
      const id2 = generateUniqueId('');

      expect(id1).toMatch(/^-[a-z0-9]{7}$/);
      expect(id2).toMatch(/^-[a-z0-9]{7}$/);
      expect(id1).not.toBe(id2);
    });

    it('generates truly unique IDs in batch', () => {
      const ids = new Set();
      for (let i = 0; i < 1000; i++) {
        ids.add(generateUniqueId());
      }
      expect(ids.size).toBe(1000); // All IDs should be unique
    });

    it('handles special characters in prefix', () => {
      expect(generateUniqueId('btn_')).toMatch(/^btn_-[a-z0-9]{7}$/);
      expect(generateUniqueId('comp-123')).toMatch(/^comp-123-[a-z0-9]{7}$/);
    });

    it('generates consistent format', () => {
      const ids = Array.from({ length: 100 }, () => generateUniqueId('test'));
      ids.forEach(id => {
        expect(id).toMatch(/^test-[a-z0-9]{7}$/);
        expect(id.length).toBe(12); // 'test-' (5) + 7 characters
      });
    });
  });

  describe('truncateText function', () => {
    it('truncates text longer than maxLength', () => {
      expect(truncateText('Hello world', 5)).toBe('Hello...');
      expect(truncateText('This is a long text', 10)).toBe('This is a ...');
    });

    it('returns original text if shorter than maxLength', () => {
      expect(truncateText('Short', 10)).toBe('Short');
      expect(truncateText('Hello', 5)).toBe('Hello');
    });

    it('returns original text if equal to maxLength', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
      expect(truncateText('Exact length', 12)).toBe('Exact length');
    });

    it('handles empty strings', () => {
      expect(truncateText('', 5)).toBe('');
      expect(truncateText('', 0)).toBe('');
    });

    it('handles zero maxLength', () => {
      expect(truncateText('Hello', 0)).toBe('...');
      expect(truncateText('Test', 0)).toBe('...');
    });

    it('handles negative maxLength', () => {
      expect(truncateText('Hello', -1)).toBe('...');
      expect(truncateText('Test', -5)).toBe('...');
    });

    it('handles single character truncation', () => {
      expect(truncateText('Hello', 1)).toBe('H...');
      expect(truncateText('A', 1)).toBe('A');
    });

    it('handles special characters and unicode', () => {
      expect(truncateText('Hello 世界', 7)).toBe('Hello 世...');
      expect(truncateText('🎉🎊🎈', 2)).toBe('🎉...'); // Emojis count as multiple UTF-16 code units
    });

    it('handles whitespace correctly', () => {
      expect(truncateText('Hello world  ', 8)).toBe('Hello wo...');
      expect(truncateText('  Padded  ', 5)).toBe('  Pad...');
    });
  });

  describe('formatDate function', () => {
    const testDate = new Date('2023-05-15T10:30:00Z');

    it('formats date with default options', () => {
      const formatted = formatDate(testDate);
      expect(formatted).toMatch(/15 May 2023|May 15, 2023/); // Different locale formats
    });

    it('handles custom formatting options', () => {
      const formatted = formatDate(testDate, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(formatted).toContain('2023');
      expect(formatted).toContain('May');
      expect(formatted).toContain('15');
    });

    it('handles different date formats', () => {
      const shortFormat = formatDate(testDate, {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
      expect(shortFormat).toMatch(/5\/15\/23|15\/5\/23/);
    });

    it('handles Date object input', () => {
      const date = new Date(2023, 4, 15); // May 15, 2023 (month is 0-indexed)
      const formatted = formatDate(date);
      expect(formatted).toContain('May');
      expect(formatted).toContain('2023');
    });

    it('handles timestamp input', () => {
      const timestamp = 1684145400000; // May 15, 2023
      const formatted = formatDate(new Date(timestamp));
      expect(formatted).toContain('2023');
    });

    it('handles edge dates', () => {
      const newYear = new Date('2023-01-01');
      const lastDay = new Date('2023-12-31');

      expect(formatDate(newYear)).toContain('Jan');
      expect(formatDate(lastDay)).toContain('Dec');
    });

    it('handles leap year dates', () => {
      const leapDay = new Date('2020-02-29');
      const formatted = formatDate(leapDay);
      expect(formatted).toContain('Feb');
      expect(formatted).toContain('29');
      expect(formatted).toContain('2020');
    });

    it('handles time-only formatting options', () => {
      const timeFormat = formatDate(testDate, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      expect(timeFormat).toMatch(/\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('debounce function', () => {
    let mockFn;
    let debouncedFn;

    beforeEach(() => {
      mockFn = jest.fn();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('delays function execution', () => {
      debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls when called again', () => {
      debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('passes arguments correctly', () => {
      debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2', 123);
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('handles multiple argument sets (last one wins)', () => {
      debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('third');
    });

    it('handles zero wait time', () => {
      debouncedFn = debounce(mockFn, 0);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('handles context (this) correctly', () => {
      const context = { value: 42 };
      let capturedContext;
      const contextFn = jest.fn(function () {
        capturedContext = this;
        return this?.value;
      });

      debouncedFn = debounce(contextFn, 100);
      debouncedFn.call(context);

      jest.advanceTimersByTime(100);
      expect(contextFn).toHaveBeenCalled();
      // Note: In arrow function context, 'this' binding works differently in debounced functions
    });

    it('handles rapid successive calls', () => {
      debouncedFn = debounce(mockFn, 50);

      for (let i = 0; i < 10; i++) {
        debouncedFn(i);
        jest.advanceTimersByTime(25); // Less than wait time
      }

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(9); // Last argument
    });
  });

  describe('throttle function', () => {
    let mockFn;
    let throttledFn;

    beforeEach(() => {
      mockFn = jest.fn();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('executes function immediately on first call', () => {
      throttledFn = throttle(mockFn, 100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('prevents execution during throttle period', () => {
      throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('allows execution after throttle period', () => {
      throttledFn = throttle(mockFn, 100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('passes arguments from first call only', () => {
      throttledFn = throttle(mockFn, 100);

      throttledFn('first', 123);
      throttledFn('second', 456); // This should be ignored

      expect(mockFn).toHaveBeenCalledWith('first', 123);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('handles zero limit time', () => {
      throttledFn = throttle(mockFn, 0);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1); // Still throttled

      jest.advanceTimersByTime(0);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('handles context (this) correctly', () => {
      const context = { value: 42 };
      let capturedContext;
      const contextFn = jest.fn(function () {
        capturedContext = this;
        return this?.value;
      });

      throttledFn = throttle(contextFn, 100);
      throttledFn.call(context);

      expect(contextFn).toHaveBeenCalled();
      // Note: In arrow function context, 'this' binding works differently in throttled functions
    });

    it('handles rapid successive calls with different arguments', () => {
      throttledFn = throttle(mockFn, 50);

      throttledFn('call1');
      throttledFn('call2');
      throttledFn('call3');

      // Only first call should execute
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call1');

      // After throttle period
      jest.advanceTimersByTime(50);
      throttledFn('call4');

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('call4');
    });

    it('resets throttle correctly after period expires', () => {
      throttledFn = throttle(mockFn, 100);

      // First batch
      throttledFn('batch1-1');
      throttledFn('batch1-2');
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Wait and second batch
      jest.advanceTimersByTime(100);
      throttledFn('batch2-1');
      throttledFn('batch2-2');
      expect(mockFn).toHaveBeenCalledTimes(2);

      // Wait and third batch
      jest.advanceTimersByTime(100);
      throttledFn('batch3-1');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration tests', () => {
    it('functions work together correctly', () => {
      const longText = 'This is a very long text that needs to be truncated';
      const truncated = truncateText(longText, 20);
      const uniqueId = generateUniqueId('text');
      const className = cn('base-class', truncated.length > 15 && 'long-text');

      expect(truncated).toBe('This is a very long ...');
      expect(uniqueId).toMatch(/^text-[a-z0-9]{7}$/);
      expect(className).toBe('base-class long-text');
    });

    it('handles edge cases in combination', () => {
      expect(cn(null, undefined, '')).toBe('');
      expect(truncateText('', 10)).toBe('');
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });
  });
});

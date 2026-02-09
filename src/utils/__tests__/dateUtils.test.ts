import { describe, it, expect } from 'vitest';
import { formatDate, isDateInRange, isDateBefore, isDateAfter } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format ISO date string correctly', () => {
      const result = formatDate('2026-02-09');
      expect(result).toBe('Feb 9, 2026');
    });

    it('should format date with leading zeros', () => {
      const result = formatDate('2026-01-05');
      expect(result).toBe('Jan 5, 2026');
    });

    it('should handle different months', () => {
      expect(formatDate('2026-12-25')).toBe('Dec 25, 2026');
      expect(formatDate('2026-06-15')).toBe('Jun 15, 2026');
    });
  });

  describe('isDateInRange', () => {
    it('should return true when date is within range', () => {
      const date = new Date('2026-02-09');
      const result = isDateInRange(date, '2026-02-01', '2026-02-28');
      expect(result).toBe(true);
    });

    it('should return true when date equals start date', () => {
      const date = new Date('2026-02-01');
      const result = isDateInRange(date, '2026-02-01', '2026-02-28');
      expect(result).toBe(true);
    });

    it('should return true when date equals end date', () => {
      const date = new Date('2026-02-28');
      const result = isDateInRange(date, '2026-02-01', '2026-02-28');
      expect(result).toBe(true);
    });

    it('should return false when date is before range', () => {
      const date = new Date('2026-01-31');
      const result = isDateInRange(date, '2026-02-01', '2026-02-28');
      expect(result).toBe(false);
    });

    it('should return false when date is after range', () => {
      const date = new Date('2026-03-01');
      const result = isDateInRange(date, '2026-02-01', '2026-02-28');
      expect(result).toBe(false);
    });
  });

  describe('isDateBefore', () => {
    it('should return true when first date is before second', () => {
      const date = new Date('2026-02-08');
      const result = isDateBefore(date, '2026-02-09');
      expect(result).toBe(true);
    });

    it('should return false when first date is after second', () => {
      const date = new Date('2026-02-10');
      const result = isDateBefore(date, '2026-02-09');
      expect(result).toBe(false);
    });

    it('should return false when dates are equal', () => {
      const date = new Date('2026-02-09');
      const result = isDateBefore(date, '2026-02-09');
      expect(result).toBe(false);
    });
  });

  describe('isDateAfter', () => {
    it('should return true when first date is after second', () => {
      const date = new Date('2026-02-10');
      const result = isDateAfter(date, '2026-02-09');
      expect(result).toBe(true);
    });

    it('should return false when first date is before second', () => {
      const date = new Date('2026-02-08');
      const result = isDateAfter(date, '2026-02-09');
      expect(result).toBe(false);
    });

    it('should return false when dates are equal', () => {
      const date = new Date('2026-02-09');
      const result = isDateAfter(date, '2026-02-09');
      expect(result).toBe(false);
    });
  });
});

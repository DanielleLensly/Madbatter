import { describe, it, expect } from 'vitest';
import { formatPhoneNumber, unformatPhoneNumber, isValidPhoneNumber } from '../phoneUtils';

describe('phoneUtils', () => {
  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone number correctly', () => {
      const result = formatPhoneNumber('0821234567');
      expect(result).toBe('082 123 4567');
    });

    it('should handle partial input (3 digits)', () => {
      const result = formatPhoneNumber('082');
      expect(result).toBe('082');
    });

    it('should handle partial input (6 digits)', () => {
      const result = formatPhoneNumber('082123');
      expect(result).toBe('082 123');
    });

    it('should remove non-digit characters', () => {
      const result = formatPhoneNumber('082-123-4567');
      expect(result).toBe('082 123 4567');
    });

    it('should limit to 10 digits', () => {
      const result = formatPhoneNumber('082123456789');
      expect(result).toBe('082 123 4567');
    });

    it('should handle empty string', () => {
      const result = formatPhoneNumber('');
      expect(result).toBe('');
    });
  });

  describe('unformatPhoneNumber', () => {
    it('should remove spaces from formatted number', () => {
      const result = unformatPhoneNumber('082 123 4567');
      expect(result).toBe('0821234567');
    });

    it('should handle unformatted number', () => {
      const result = unformatPhoneNumber('0821234567');
      expect(result).toBe('0821234567');
    });

    it('should handle empty string', () => {
      const result = unformatPhoneNumber('');
      expect(result).toBe('');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return true for valid 10-digit number', () => {
      expect(isValidPhoneNumber('0821234567')).toBe(true);
      expect(isValidPhoneNumber('082 123 4567')).toBe(true);
    });

    it('should return false for numbers with less than 10 digits', () => {
      expect(isValidPhoneNumber('082123456')).toBe(false);
      expect(isValidPhoneNumber('082')).toBe(false);
    });

    it('should return false for numbers with more than 10 digits', () => {
      expect(isValidPhoneNumber('08212345678')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidPhoneNumber('')).toBe(false);
    });
  });
});

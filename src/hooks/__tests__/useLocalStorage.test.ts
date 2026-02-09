import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));

    expect(result.current[0]).toBe('defaultValue');
  });

  it('should initialize with value from localStorage if it exists', () => {
    localStorage.setItem('testKey', JSON.stringify('storedValue'));

    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));

    expect(result.current[0]).toBe('storedValue');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('should handle complex objects', () => {
    const testObject = { name: 'Test', count: 42 };
    const { result } = renderHook(() => useLocalStorage('testKey', testObject));

    expect(result.current[0]).toEqual(testObject);

    const newObject = { name: 'Updated', count: 100 };
    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(JSON.parse(localStorage.getItem('testKey')!)).toEqual(newObject);
  });

  it('should handle arrays', () => {
    const testArray = [1, 2, 3];
    const { result } = renderHook(() => useLocalStorage('testKey', testArray));

    expect(result.current[0]).toEqual(testArray);

    const newArray = [4, 5, 6];
    act(() => {
      result.current[1](newArray);
    });

    expect(result.current[0]).toEqual(newArray);
  });

  it('should persist across hook instances', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('testKey', 'initial'));

    act(() => {
      result1.current[1]('updated');
    });

    const { result: result2 } = renderHook(() => useLocalStorage('testKey', 'initial'));

    expect(result2.current[0]).toBe('updated');
  });
});

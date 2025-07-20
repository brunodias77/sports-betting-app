import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import useLoadingState from '../useLoadingState';

describe('useLoadingState', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useLoadingState());

    expect(result.current.isLoading).toBe(false);
  });

  it('should initialize with custom initial state', () => {
    const { result } = renderHook(() => useLoadingState(true));

    expect(result.current.isLoading).toBe(true);
  });

  it('should start loading', () => {
    const { result } = renderHook(() => useLoadingState());

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should stop loading', () => {
    const { result } = renderHook(() => useLoadingState(true));

    act(() => {
      result.current.stopLoading();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle successful async operation with withLoading', async () => {
    const { result } = renderHook(() => useLoadingState());
    const asyncFn = vi.fn().mockResolvedValue('success');

    let returnValue;
    await act(async () => {
      returnValue = await result.current.withLoading(asyncFn);
    });

    expect(returnValue).toBe('success');
    expect(result.current.isLoading).toBe(false);
    expect(asyncFn).toHaveBeenCalled();
  });

  it('should handle failed async operation with withLoading', async () => {
    const { result } = renderHook(() => useLoadingState());
    const error = new Error('Test error');
    const asyncFn = vi.fn().mockRejectedValue(error);

    await act(async () => {
      try {
        await result.current.withLoading(asyncFn);
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(asyncFn).toHaveBeenCalled();
  });

  it('should set loading to true during async operation', async () => {
    const { result } = renderHook(() => useLoadingState());
    let loadingDuringExecution = false;
    
    const asyncFn = vi.fn().mockImplementation(async () => {
      loadingDuringExecution = result.current.isLoading;
      return 'success';
    });

    await act(async () => {
      await result.current.withLoading(asyncFn);
    });

    expect(loadingDuringExecution).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should stop loading even if async operation throws', async () => {
    const { result } = renderHook(() => useLoadingState());
    const asyncFn = vi.fn().mockRejectedValue(new Error('Test error'));

    await act(async () => {
      try {
        await result.current.withLoading(asyncFn);
      } catch {
        // Ignore error for this test
      }
    });

    expect(result.current.isLoading).toBe(false);
  });
});
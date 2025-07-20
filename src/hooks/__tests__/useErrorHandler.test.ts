import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import useErrorHandler from '../useErrorHandler';

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
    console.warn = vi.fn();
  });

  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('should handle Error objects', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.error).toBe('Test error');
    expect(result.current.hasError).toBe(true);
  });

  it('should handle string errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError('String error');
    });

    expect(result.current.error).toBe('String error');
    expect(result.current.hasError).toBe(true);
  });

  it('should handle unknown errors with fallback message', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError({ unknown: 'object' });
    });

    expect(result.current.error).toBe('Ocorreu um erro inesperado');
    expect(result.current.hasError).toBe(true);
  });

  it('should use custom fallback message', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError({ unknown: 'object' }, {
        fallbackMessage: 'Custom fallback'
      });
    });

    expect(result.current.error).toBe('Custom fallback');
  });

  it('should log errors when logError is true', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError, { logError: true });
    });

    expect(console.error).toHaveBeenCalledWith('Error handled by useErrorHandler:', testError);
  });

  it('should not log errors when logError is false', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError, { logError: false });
    });

    expect(console.error).not.toHaveBeenCalled();
  });

  it('should show toast notification when showToast is true', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError, { showToast: true });
    });

    expect(console.warn).toHaveBeenCalledWith('Toast notification would show:', 'Test error');
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError('Test error');
    });

    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('should handle successful async operations', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const successfulFn = vi.fn().mockResolvedValue('success');

    let returnValue;
    await act(async () => {
      returnValue = await result.current.retryWithErrorHandling(successfulFn);
    });

    expect(returnValue).toBe('success');
    expect(result.current.hasError).toBe(false);
    expect(successfulFn).toHaveBeenCalled();
  });

  it('should handle failed async operations', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const failingFn = vi.fn().mockRejectedValue(new Error('Async error'));

    let returnValue;
    await act(async () => {
      returnValue = await result.current.retryWithErrorHandling(failingFn);
    });

    expect(returnValue).toBeNull();
    expect(result.current.error).toBe('Async error');
    expect(result.current.hasError).toBe(true);
    expect(failingFn).toHaveBeenCalled();
  });

  it('should clear error before retrying async operation', async () => {
    const { result } = renderHook(() => useErrorHandler());

    // First, set an error
    act(() => {
      result.current.handleError('Initial error');
    });

    expect(result.current.hasError).toBe(true);

    // Then retry with successful operation
    const successfulFn = vi.fn().mockResolvedValue('success');

    await act(async () => {
      await result.current.retryWithErrorHandling(successfulFn);
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
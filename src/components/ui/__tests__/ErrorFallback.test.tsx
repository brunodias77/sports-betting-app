import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ErrorFallback from '../ErrorFallback';

describe('ErrorFallback', () => {
  it('should render default error message', () => {
    render(<ErrorFallback />);

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText(/Ocorreu um erro inesperado/)).toBeInTheDocument();
  });

  it('should render custom title and message', () => {
    render(
      <ErrorFallback
        title="Custom Title"
        message="Custom error message"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should render error message from Error object', () => {
    const error = new Error('Test error message');
    
    render(<ErrorFallback error={error} />);

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render error message from string', () => {
    render(<ErrorFallback error="String error message" />);

    expect(screen.getByText('String error message')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    
    render(<ErrorFallback onRetry={onRetry} />);

    fireEvent.click(screen.getByText('Tentar novamente'));

    expect(onRetry).toHaveBeenCalled();
  });

  it('should call onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    
    render(<ErrorFallback onReset={onReset} />);

    fireEvent.click(screen.getByText('Voltar'));

    expect(onReset).toHaveBeenCalled();
  });

  it('should show reload button when showReload is true and no onRetry', () => {
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    render(<ErrorFallback showReload={true} />);

    expect(screen.getByText('Recarregar página')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Recarregar página'));

    expect(mockReload).toHaveBeenCalled();
  });

  it('should not show reload button when onRetry is provided', () => {
    const onRetry = vi.fn();
    
    render(<ErrorFallback onRetry={onRetry} showReload={true} />);

    expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    expect(screen.queryByText('Recarregar página')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<ErrorFallback className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
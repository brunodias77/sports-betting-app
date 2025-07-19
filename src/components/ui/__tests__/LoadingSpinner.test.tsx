import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
    expect(spinner).toHaveClass('animate-spin', 'h-6', 'w-6', 'text-primary-600');
  });

  it('should render with small size', () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('should render with medium size', () => {
    render(<LoadingSpinner size="md" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-6', 'w-6');
  });

  it('should render with large size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('should render with extra large size', () => {
    render(<LoadingSpinner size="xl" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('should render with primary color', () => {
    render(<LoadingSpinner color="primary" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-primary-600');
  });

  it('should render with white color', () => {
    render(<LoadingSpinner color="white" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-white');
  });

  it('should render with gray color', () => {
    render(<LoadingSpinner color="gray" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-gray-600');
  });

  it('should apply custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('should combine size and color props', () => {
    render(<LoadingSpinner size="lg" color="white" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-8', 'w-8', 'text-white');
  });

  it('should have proper SVG structure', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    
    // Check for circle element
    const circle = spinner.querySelector('circle');
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute('cx', '12');
    expect(circle).toHaveAttribute('cy', '12');
    expect(circle).toHaveAttribute('r', '10');
    
    // Check for path element
    const path = spinner.querySelector('path');
    expect(path).toBeInTheDocument();
  });

  it('should have accessibility attributes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});
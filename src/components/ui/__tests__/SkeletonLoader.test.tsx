import React from 'react';
import { render, screen } from '@testing-library/react';
import SkeletonLoader from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  it('should render with default props', () => {
    render(<SkeletonLoader />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-label', 'Carregando...');
  });

  it('should apply text variant classes', () => {
    render(<SkeletonLoader variant="text" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('rounded');
  });

  it('should apply rectangular variant classes', () => {
    render(<SkeletonLoader variant="rectangular" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('rounded-md');
  });

  it('should apply circular variant classes', () => {
    render(<SkeletonLoader variant="circular" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('should apply pulse animation by default', () => {
    render(<SkeletonLoader />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-200');
  });

  it('should apply wave animation', () => {
    render(<SkeletonLoader animation="wave" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('should apply no animation', () => {
    render(<SkeletonLoader animation="none" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('bg-gray-200');
    expect(skeleton).not.toHaveClass('animate-pulse');
  });

  it('should apply custom width and height as strings', () => {
    render(<SkeletonLoader width="200px" height="50px" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '50px'
    });
  });

  it('should apply custom width and height as numbers', () => {
    render(<SkeletonLoader width={200} height={50} />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '50px'
    });
  });

  it('should apply custom className', () => {
    render(<SkeletonLoader className="custom-class" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('custom-class');
  });
});
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../Badge';

describe('Badge', () => {
  it('should render with default props', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('inline-flex', 'items-center', 'font-medium', 'rounded-full');
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm'); // medium size
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800'); // default variant
  });

  it('should render with small size', () => {
    render(<Badge size="sm">Small Badge</Badge>);
    const badge = screen.getByText('Small Badge');
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
  });

  it('should render with medium size', () => {
    render(<Badge size="md">Medium Badge</Badge>);
    const badge = screen.getByText('Medium Badge');
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm');
  });

  it('should render with large size', () => {
    render(<Badge size="lg">Large Badge</Badge>);
    const badge = screen.getByText('Large Badge');
    expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base');
  });

  it('should render with default variant', () => {
    render(<Badge variant="default">Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('should render with primary variant', () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText('Primary');
    expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');
  });

  it('should render with success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-success-100', 'text-success-800');
  });

  it('should render with danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>);
    const badge = screen.getByText('Danger');
    expect(badge).toHaveClass('bg-danger-100', 'text-danger-800');
  });

  it('should render with warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-warning-100', 'text-warning-800');
  });

  it('should render with live variant', () => {
    render(<Badge variant="live">LIVE</Badge>);
    const badge = screen.getByText('LIVE');
    expect(badge).toHaveClass('bg-danger-500', 'text-white', 'animate-pulse');
    
    // Check for live indicator dot
    const liveDot = badge.querySelector('span');
    expect(liveDot).toBeInTheDocument();
    expect(liveDot).toHaveClass('w-2', 'h-2', 'bg-white', 'rounded-full', 'animate-pulse');
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('should combine size and variant props', () => {
    render(<Badge size="lg" variant="success">Large Success</Badge>);
    const badge = screen.getByText('Large Success');
    expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base'); // large size
    expect(badge).toHaveClass('bg-success-100', 'text-success-800'); // success variant
  });

  it('should render complex content', () => {
    render(
      <Badge variant="primary">
        <span>Icon</span> Text
      </Badge>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should not show live indicator for non-live variants', () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText('Primary');
    
    // Should not have a live indicator dot
    const liveDot = badge.querySelector('span');
    expect(liveDot).not.toBeInTheDocument();
  });

  it('should show live indicator only for live variant', () => {
    render(<Badge variant="live">LIVE</Badge>);
    const badge = screen.getByText('LIVE');
    
    // Should have exactly one span (the live indicator)
    const spans = badge.querySelectorAll('span');
    expect(spans).toHaveLength(1);
    expect(spans[0]).toHaveClass('w-2', 'h-2', 'bg-white', 'rounded-full');
  });

  it('should render different badge types for betting statuses', () => {
    const { rerender } = render(<Badge variant="success">Won</Badge>);
    expect(screen.getByText('Won')).toHaveClass('bg-success-100', 'text-success-800');

    rerender(<Badge variant="danger">Lost</Badge>);
    expect(screen.getByText('Lost')).toHaveClass('bg-danger-100', 'text-danger-800');

    rerender(<Badge variant="warning">Active</Badge>);
    expect(screen.getByText('Active')).toHaveClass('bg-warning-100', 'text-warning-800');

    rerender(<Badge variant="live">LIVE</Badge>);
    expect(screen.getByText('LIVE')).toHaveClass('bg-danger-500', 'text-white', 'animate-pulse');
  });
});
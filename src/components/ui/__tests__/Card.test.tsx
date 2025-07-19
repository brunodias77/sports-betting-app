import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Card from '../Card';

describe('Card', () => {
  it('should render with default props', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'p-4');
  });

  it('should render with default variant', () => {
    render(<Card variant="default">Default card</Card>);
    const card = screen.getByText('Default card');
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
    expect(card).not.toHaveClass('hover:shadow-lg', 'cursor-pointer');
  });

  it('should render with hover variant', () => {
    render(<Card variant="hover">Hover card</Card>);
    const card = screen.getByText('Hover card');
    expect(card).toHaveClass('transition-shadow', 'duration-200', 'hover:shadow-lg', 'cursor-pointer');
  });

  it('should render with selected variant', () => {
    render(<Card variant="selected">Selected card</Card>);
    const card = screen.getByText('Selected card');
    expect(card).toHaveClass('ring-2', 'ring-primary-500', 'border-primary-500', 'shadow-lg');
  });

  it('should render with small padding', () => {
    render(<Card padding="sm">Small padding</Card>);
    const card = screen.getByText('Small padding');
    expect(card).toHaveClass('p-3');
  });

  it('should render with medium padding', () => {
    render(<Card padding="md">Medium padding</Card>);
    const card = screen.getByText('Medium padding');
    expect(card).toHaveClass('p-4');
  });

  it('should render with large padding', () => {
    render(<Card padding="lg">Large padding</Card>);
    const card = screen.getByText('Large padding');
    expect(card).toHaveClass('p-6');
  });

  it('should apply custom className', () => {
    render(<Card className="custom-class">Custom card</Card>);
    const card = screen.getByText('Custom card');
    expect(card).toHaveClass('custom-class');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Ref test</Card>);
    expect(ref).toHaveBeenCalled();
  });

  it('should handle click events when clickable', () => {
    const handleClick = vi.fn();
    render(<Card variant="hover" onClick={handleClick}>Clickable card</Card>);
    const card = screen.getByText('Clickable card');
    
    card.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render complex content', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card description</p>
        <button>Action</button>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('should combine variants and padding correctly', () => {
    render(<Card variant="selected" padding="lg">Combined props</Card>);
    const card = screen.getByText('Combined props');
    expect(card).toHaveClass('ring-2', 'ring-primary-500', 'p-6');
  });
});
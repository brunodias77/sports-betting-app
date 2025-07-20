import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsCard from '../StatsCard';

describe('StatsCard', () => {
  it('should render basic stats card with title and value', () => {
    render(
      <StatsCard
        title="Total Bets"
        value={10}
      />
    );
    
    expect(screen.getByText('Total Bets')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
  
  it('should render subtitle when provided', () => {
    render(
      <StatsCard
        title="Win Rate"
        value="75.5%"
        subtitle="3 wins out of 4 bets"
      />
    );
    
    expect(screen.getByText('Win Rate')).toBeInTheDocument();
    expect(screen.getByText('75.5%')).toBeInTheDocument();
    expect(screen.getByText('3 wins out of 4 bets')).toBeInTheDocument();
  });
  
  it('should apply success variant styling', () => {
    const { container } = render(
      <StatsCard
        title="Total Winnings"
        value="R$ 150,00"
        variant="success"
      />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('text-green-600', 'border-green-200', 'bg-green-50');
  });
  
  it('should apply danger variant styling', () => {
    const { container } = render(
      <StatsCard
        title="Total Losses"
        value="R$ 50,00"
        variant="danger"
      />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('text-red-600', 'border-red-200', 'bg-red-50');
  });
  
  it('should apply warning variant styling', () => {
    const { container } = render(
      <StatsCard
        title="Active Bets"
        value={3}
        variant="warning"
      />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('text-yellow-600', 'border-yellow-200', 'bg-yellow-50');
  });
  
  it('should show loading skeleton when isLoading is true', () => {
    const { container } = render(
      <StatsCard
        title="Loading Stats"
        value="100"
        isLoading={true}
      />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('animate-pulse');
    
    // Should not show actual content when loading
    expect(screen.queryByText('Loading Stats')).not.toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });
  
  it('should handle numeric and string values', () => {
    const { rerender } = render(
      <StatsCard
        title="Numeric Value"
        value={42}
      />
    );
    
    expect(screen.getByText('42')).toBeInTheDocument();
    
    rerender(
      <StatsCard
        title="String Value"
        value="R$ 100,00"
      />
    );
    
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
  });
  
  it('should apply default variant when no variant specified', () => {
    const { container } = render(
      <StatsCard
        title="Default Card"
        value="Default"
      />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('text-gray-900', 'border-gray-200', 'bg-white');
  });
});
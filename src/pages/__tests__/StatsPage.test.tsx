import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatsPage from '../StatsPage';

// Mock the BettingStats component
vi.mock('../../components/features/BettingStats', () => ({
  default: () => <div data-testid="betting-stats">Mocked BettingStats</div>
}));

describe('StatsPage', () => {
  it('should render page header with title and description', () => {
    render(<StatsPage />);
    
    expect(screen.getByText('Estatísticas de Apostas')).toBeInTheDocument();
    expect(screen.getByText('Acompanhe seu desempenho e analise suas apostas esportivas')).toBeInTheDocument();
  });
  
  it('should render BettingStats component', () => {
    render(<StatsPage />);
    
    expect(screen.getByTestId('betting-stats')).toBeInTheDocument();
  });
  
  it('should have proper page layout structure', () => {
    const { container } = render(<StatsPage />);
    
    // Check for main container classes
    const mainContainer = container.querySelector('.min-h-screen.bg-gray-50');
    expect(mainContainer).toBeInTheDocument();
    
    // Check for responsive container
    const responsiveContainer = container.querySelector('.max-w-7xl.mx-auto');
    expect(responsiveContainer).toBeInTheDocument();
  });
  
  it('should have proper heading hierarchy', () => {
    render(<StatsPage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Estatísticas de Apostas');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
  });
});
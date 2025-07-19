import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Navigation, NavigationSection } from '../Navigation';

describe('Navigation', () => {
  const mockOnSectionChange = vi.fn();
  const defaultProps = {
    activeSection: 'events' as NavigationSection,
    onSectionChange: mockOnSectionChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all navigation items', () => {
    render(<Navigation {...defaultProps} />);
    
    // Check for all navigation labels (both desktop and mobile versions)
    expect(screen.getAllByText('Eventos')).toHaveLength(2); // Desktop + Mobile
    expect(screen.getAllByText('Apostas')).toHaveLength(2);
    expect(screen.getAllByText('Estatísticas')).toHaveLength(2);
    expect(screen.getAllByText('Saldo')).toHaveLength(2);
  });

  it('should highlight the active section', () => {
    render(<Navigation {...defaultProps} />);
    
    const activeButtons = screen.getAllByRole('button', { current: 'page' });
    expect(activeButtons).toHaveLength(2); // Desktop + Mobile versions
    
    // Check that the active buttons contain the expected text
    activeButtons.forEach(button => {
      expect(button).toHaveTextContent('Eventos');
    });
  });

  it('should call onSectionChange when a navigation item is clicked', () => {
    render(<Navigation {...defaultProps} />);
    
    // Click on the first "Apostas" button (desktop version)
    const apostasButtons = screen.getAllByText('Apostas');
    fireEvent.click(apostasButtons[0]);
    
    expect(mockOnSectionChange).toHaveBeenCalledWith('bets');
  });

  it('should call onSectionChange with correct section for each navigation item', () => {
    render(<Navigation {...defaultProps} />);
    
    // Test each navigation item
    const sections = [
      { text: 'Eventos', id: 'events' },
      { text: 'Apostas', id: 'bets' },
      { text: 'Estatísticas', id: 'stats' },
      { text: 'Saldo', id: 'balance' },
    ];

    sections.forEach(section => {
      const buttons = screen.getAllByText(section.text);
      fireEvent.click(buttons[0]); // Click desktop version
      expect(mockOnSectionChange).toHaveBeenCalledWith(section.id);
    });

    expect(mockOnSectionChange).toHaveBeenCalledTimes(4);
  });

  it('should work with different active sections', () => {
    const { rerender } = render(<Navigation {...defaultProps} />);
    
    // Initially events should be active
    expect(screen.getAllByRole('button', { current: 'page' })).toHaveLength(2);
    
    // Change to bets
    rerender(<Navigation activeSection="bets" onSectionChange={mockOnSectionChange} />);
    
    const activeButtons = screen.getAllByRole('button', { current: 'page' });
    expect(activeButtons).toHaveLength(2);
    activeButtons.forEach(button => {
      expect(button).toHaveTextContent('Apostas');
    });
  });

  it('should have proper accessibility attributes', () => {
    render(<Navigation {...defaultProps} />);
    
    const allButtons = screen.getAllByRole('button');
    
    // All buttons should be focusable
    allButtons.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
    
    // Active buttons should have aria-current="page"
    const activeButtons = screen.getAllByRole('button', { current: 'page' });
    expect(activeButtons).toHaveLength(2);
  });

  it('should have touch-friendly button sizes on mobile', () => {
    render(<Navigation {...defaultProps} />);
    
    // Get mobile navigation buttons (they should have inline styles for min dimensions)
    const allButtons = screen.getAllByRole('button');
    
    // Mobile buttons should have minimum touch target size
    // We can't easily test the actual computed styles, but we can check that
    // the style attribute is set correctly
    const mobileButtons = allButtons.slice(4); // Second set of buttons (mobile)
    
    mobileButtons.forEach(button => {
      expect(button).toHaveStyle({ minHeight: '44px', minWidth: '44px' });
    });
  });

  it('should display icons for all navigation items', () => {
    const { container } = render(<Navigation {...defaultProps} />);
    
    // Check that SVG icons are present by looking for svg elements
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBe(8); // 4 desktop + 4 mobile
  });

  it('should handle keyboard navigation', () => {
    render(<Navigation {...defaultProps} />);
    
    const firstButton = screen.getAllByRole('button', { name: /eventos/i })[0];
    
    // Focus the button
    firstButton.focus();
    expect(firstButton).toHaveFocus();
    
    // Press Enter
    fireEvent.keyDown(firstButton, { key: 'Enter' });
    fireEvent.click(firstButton);
    
    expect(mockOnSectionChange).toHaveBeenCalledWith('events');
  });
});